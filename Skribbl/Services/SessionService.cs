using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Skribbl.DTO;
using Skribbl.Enums;
using Skribbl.Helpers;
using Skribbl.Hubs;
using Skribbl.Interfaces;
using Skribbl.Models;
using System.Threading.Tasks;

namespace Skribbl.Services
{
    public class SessionService : IService
    {
        private readonly IRegistry _registryManager;
        private readonly IHubContext<SessionHub> _hubContext;

        public SessionService(IRegistry registryManager, IHubContext<SessionHub> hubContext)
        {
            _registryManager = registryManager;
            _hubContext = hubContext;
        }

        public string CreateRoom()
        {
            var roomId = GenerateUniqueId();
            var newState = new SessionState(roomId);
            _registryManager.AddRoom(newState);

            return roomId;
        }

        private string GenerateUniqueId()
        {
            return Guid.NewGuid().ToString().Substring(0, 6).ToUpper();
        }

        public List<Participant> FetchParticipants(string roomId, string? sort = "score_desc")
        { 
            var participants = _registryManager.FetchParticipants(roomId, sort);

            if (string.Equals(sort, "score_asc", StringComparison.OrdinalIgnoreCase))
            {
                return participants.OrderBy(p => p.Score).ToList();
            }

            return participants.OrderByDescending(p => p.Score).ToList();
        }
        public async Task<bool> JoinRoom(string roomId, JoinRoomRequest request)
        {
            var room = _registryManager.GetRoomByRoomId(roomId);
            if (room == null)
            {
                Console.WriteLine($"[DEBUG] Join failed: Room {roomId} not found.");
                return false;
            }

            if (string.IsNullOrEmpty(request.Username))
            {
                Console.WriteLine("[DEBUG] Join failed: Username is null or empty.");
                return false;
            }
            var participant = new Participant { Username = request.Username, ConnectionId = request.ConnectionId, Score = 0, AvatarOptions = request.AvatarOptions };
            _registryManager.AddParticipantToRoom(roomId, participant);

            await _hubContext.Clients.Client(request.ConnectionId).SendAsync("UpdatePlayers", room.Participants);

            //late joiners logic
            if (room.IsStarted)
            {
                await _hubContext.Clients.Client(request.ConnectionId).SendAsync("GameStarted");
                await _hubContext.Clients.Client(request.ConnectionId).SendAsync("RoundStarted", new { CurrentRound = room.CurrentRound, TotalRounds = room.TotalRounds });

                await _hubContext.Clients.Client(request.ConnectionId).SendAsync("OnRoleAssigned", new RoleAssignmentEvent { Role = "Guesser", WordList = null });

                if (room.IsTurnActive && room.CurrentWord != null && room.TurnEndTime.HasValue)
                {
                    var maskedWord = string.Join(" ", room.CurrentWord.Select(c => c == ' ' ? " " : "_"));

                    var turnStartedPayload = new
                    {
                        Word = maskedWord,
                        TurnEndTime = room.TurnEndTime.Value,
                        CurrentRound = room.CurrentRound,
                        TotalRounds = room.TotalRounds
                    };

                    await _hubContext.Clients.Client(request.ConnectionId).SendAsync("OnTurnStarted", turnStartedPayload);
                    await _hubContext.Clients.Client(request.ConnectionId).SendAsync("CanvasUpdate", _registryManager.FetchCanvasUpdates(roomId));
                }
            }
            return true;

        }

        public string? LeaveRoom(string connectionId)
        {
            var room = _registryManager.GetRoomByConnectionId(connectionId);
            if (room == null)
            {
                return null;
            }
            var roomId = room.Id;
            _registryManager.RemoveParticipant(connectionId);
            return roomId;
        }

        public Participant GetWinner(string roomId)
        {
            throw new NotImplementedException();
        }

        public bool AddPoints(string roomId, string connectionId, int newScore)
        {
            throw new NotImplementedException();
        }

        public Participant GetNextDrawer(string roomId)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> StartMatchmakingGame(string connectionId)
        {
            var room = _registryManager.GetRoomByConnectionId(connectionId);
            if (room == null)
            {
                return false;
            }
            room.IsStarted = true;
            room.CurrentRound = 1;
            room.DrawnPlayerConnectionIds.Clear();
            room.GuessedCorrectConnectionIds.Clear();

            var roomId = room.Id;
            var drawerConnectionid = PickNextDrawer(roomId);
            if (drawerConnectionid == null)
            {
                return false;
            }
            var words = GenerateWords(roomId);

            await _hubContext.Clients.Group(roomId).SendAsync("GameStarted");
            await _hubContext.Clients.Group(roomId).SendAsync("RoundStarted", new { CurrentRound = room.CurrentRound, TotalRounds = room.TotalRounds });

            await _hubContext.Clients.Client(drawerConnectionid).SendAsync("OnRoleAssigned", new RoleAssignmentEvent { Role = "Drawer", WordList = words });
            await _hubContext.Clients.GroupExcept(roomId, new[] { drawerConnectionid }).SendAsync("OnRoleAssigned", new RoleAssignmentEvent { Role = "Guesser", WordList = null });

            return true;
        }

        public async Task<bool> CommitSelectedWord(string connectionId, string word)
        {
            var room = _registryManager.GetRoomByConnectionId(connectionId);
            if (room == null)
            {
                return false;
            }
            room.CurrentWord = word;
            room.IsTurnActive = true;
            room.GuessedCorrectConnectionIds.Clear();

            var turnDuration = 80;
            var turnEndTime = DateTime.UtcNow.AddSeconds(turnDuration);
            room.TurnEndTime = turnEndTime;

            var drawerConnectionId = connectionId;
            var roomId = room.Id;
            var maskedWord = string.Join(" ", word.Select(c => c == ' ' ? " " : "_"));

            var turnStartedPayload = new
            {
                Word = maskedWord,
                TurnEndTime = turnEndTime,
                CurrentRound = room.CurrentRound,
                TotalRounds = room.TotalRounds
            };

            await _hubContext.Clients.Client(drawerConnectionId).SendAsync("OnTurnStarted", new { Word = word, TurnEndTime = turnEndTime, CurrentRound = room.CurrentRound, TotalRounds = room.TotalRounds });
            await _hubContext.Clients.GroupExcept(roomId, new[] { drawerConnectionId }).SendAsync("OnTurnStarted", turnStartedPayload);

            _ = StartTurnTimer(roomId, turnEndTime);

            return true;
        }

        private async Task StartTurnTimer(string roomId, DateTime turnEndTime)
        {
            await Task.Delay(TimeSpan.FromSeconds(80));

            var room = _registryManager.GetRoomByRoomId(roomId);
            if (room != null && room.IsTurnActive && room.TurnEndTime == turnEndTime)
            {
                await EndTurn(roomId);
            }
        }

        public async Task EndTurn(string roomId)
        {
            var room = _registryManager.GetRoomByRoomId(roomId);
            if (room == null || !room.IsTurnActive)
            {
                return;
            }

            room.IsTurnActive = false;
            var actualWord = room.CurrentWord;
            room.CurrentWord = null;
            room.TurnEndTime = null;
            lock (room.CanvasUpdates)
            {
                room.CanvasUpdates.Clear();
            }

            await _hubContext.Clients.Group(roomId).SendAsync("OnTurnEnded", new { Word = actualWord });

            await Task.Delay(2000);

            await ProgressGame(roomId);
        }

        public async Task ProgressGame(string roomId)
        {
            var room = _registryManager.GetRoomByRoomId(roomId);
            if (room == null) return;

            var nextDrawerConnectionId = PickNextDrawer(roomId);
            if (nextDrawerConnectionId != null)
            {
                var words = GenerateWords(roomId);

                await _hubContext.Clients.Group(roomId).SendAsync("RoundStarted", new { CurrentRound = room.CurrentRound, TotalRounds = room.TotalRounds });
                await _hubContext.Clients.Client(nextDrawerConnectionId).SendAsync("OnRoleAssigned", new RoleAssignmentEvent { Role = "Drawer", WordList = words });
                await _hubContext.Clients.GroupExcept(roomId, new[] { nextDrawerConnectionId }).SendAsync("OnRoleAssigned", new RoleAssignmentEvent { Role = "Guesser", WordList = null });
            }
            else
            {
                room.CurrentRound++;
                if (room.CurrentRound > room.TotalRounds)
                {
                    room.IsStarted = false;
                    room.CurrentWord = null;
                    room.CurrentDrawerId = null;
                    room.DrawnPlayerConnectionIds.Clear();
                    room.GuessedCorrectConnectionIds.Clear();

                    Participant? winner = null;
                    int maxScore = -1;
                    foreach (var p in room.Participants)
                    {
                        if (p.Score > maxScore)
                        {
                            maxScore = p.Score;
                            winner = p;
                        }
                    }

                    // Reset all scores to 0 so the next game starts fresh
                    foreach (var p in room.Participants)
                    {
                        p.Score = 0;
                    }

                    await _hubContext.Clients.Group(roomId).SendAsync("GameEnded", new { Winner = winner });
                }
                else
                {
                    room.DrawnPlayerConnectionIds.Clear();
                    var firstDrawerConnectionId = PickNextDrawer(roomId);
                    if (firstDrawerConnectionId != null)
                    {
                        var words = GenerateWords(roomId);
                        await _hubContext.Clients.Group(roomId).SendAsync("RoundStarted", new { CurrentRound = room.CurrentRound, TotalRounds = room.TotalRounds });
                        
                        await _hubContext.Clients.Client(firstDrawerConnectionId).SendAsync("OnRoleAssigned", new RoleAssignmentEvent { Role = "Drawer", WordList = words });
                        await _hubContext.Clients.GroupExcept(roomId, new[] { firstDrawerConnectionId }).SendAsync("OnRoleAssigned", new RoleAssignmentEvent { Role = "Guesser", WordList = null });
                    }
                }
            }
        }

        public string? PickNextDrawer(string roomId)
        {
            var room = _registryManager.GetRoomByRoomId(roomId);
            if (room == null) return null;

            var participants = _registryManager.FetchParticipants(roomId);
            var remainingDrawers = participants.Where(p => !room.DrawnPlayerConnectionIds.Contains(p.ConnectionId)).ToList();
            if (remainingDrawers.Count == 0)
            {
                return null;
            }

            remainingDrawers.Shuffle();
            var nextDrawer = remainingDrawers[0];
            room.CurrentDrawerId = nextDrawer.ConnectionId;
            room.DrawnPlayerConnectionIds.Add(nextDrawer.ConnectionId);
            return nextDrawer.ConnectionId;
        }

        public List<string> GenerateWords(string roomId)
        {
            var words = _registryManager.FetchWords(roomId);
            words.Shuffle();
            return words.Slice(0, 3);
        }

        public void AddWords(string[] words)
        {
            throw new NotImplementedException();
        }
        public void AddCanvasUpdate(CanvasUpdate canvasUpdate)
        {
            _registryManager.AddCanvasUpdate(canvasUpdate);
        }

        public List<CanvasUpdate> FetchCanvasUpdates(string roomId)
        {
            return _registryManager.FetchCanvasUpdates(roomId);
        }

        public async Task<ChatMessageEvent?> TryGuess(ChatMessageRequest request)
        {
            var room = _registryManager.GetRoomByConnectionId(request.ConnectionId);
            var participant = _registryManager.GetParticipant(request.ConnectionId);
            if (room == null || participant == null)
            {
                return null;
            }

            if (room.GuessedCorrectConnectionIds.Contains(request.ConnectionId))
            {
                return null;
            }

            var selectedWord = room.CurrentWord;
            if (selectedWord != null)
            {
                if (selectedWord.Equals(request.Message, StringComparison.OrdinalIgnoreCase))
                {
                    room.GuessedCorrectConnectionIds.Add(request.ConnectionId);
                    participant.Score += 100;

                    var drawer = room.Participants.FirstOrDefault(p => p.ConnectionId == room.CurrentDrawerId);
                    if (drawer != null)
                    {
                        drawer.Score += 50;
                    }

                    await _hubContext.Clients.Group(room.Id).SendAsync("UpdatePlayers", room.Participants);

                    var guessersCount = room.Participants.Count(p => p.ConnectionId != room.CurrentDrawerId);
                    if (room.GuessedCorrectConnectionIds.Count >= guessersCount)
                    {
                        _ = EndTurn(room.Id);
                    }

                    return new ChatMessageEvent
                    {
                        Username = participant.Username,
                        Message = $"{participant.Username} correctly guessed the word!",
                        Status = ChatMessageType.CorrectGuess
                    };
                }
            }

            return new ChatMessageEvent
            {
                Status = ChatMessageType.Default,
                Message = request.Message,
                Username = participant.Username
            };
        }

        public Task<ChatMessageEvent?> TryMakeMessage(ChatMessageRequest request)
        {
            var participant = _registryManager.GetParticipant(request.ConnectionId);
            if (participant == null)
            {
                return Task.FromResult<ChatMessageEvent?>(null);
            }

            return Task.FromResult<ChatMessageEvent?>(new ChatMessageEvent
            {
                Status = ChatMessageType.Default,
                Message = request.Message,
                Username = participant.Username
            });
        }
    }
}

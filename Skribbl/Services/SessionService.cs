using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Skribbl.DTO;
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

        public List<Participant> FetchParticipants(string roomId)
        { 
            var participants = _registryManager.FetchParticipants(roomId);

            return participants;
        }
        public bool JoinRoom(string roomId, JoinRoomDto request)
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

        public async Task<bool> StartMatchmakingRound(string connectionId)
        {
            var room = _registryManager.GetRoomByConnectionId(connectionId);
            if (room == null)
            {
                return false;
            }
            room.IsStarted = true;
            var roomId = room.Id;
            var drawerConnectionid = PickDrawer(roomId);
            var words =  GenerateWords(roomId);

            await _hubContext.Clients.Group(roomId).SendAsync("GameStarted");

            await _hubContext.Clients.Client(drawerConnectionid).SendAsync("OnRoleAssigned", new RoleAssignment { Role = "Drawer", WordList = words });
            await _hubContext.Clients.GroupExcept(roomId, new[] { drawerConnectionid }).SendAsync("OnRoleAssigned", new RoleAssignment { Role = "Guesser", WordList = null });

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

            var drawerConnectionId = connectionId;
            var roomId = room.Id;
            var maskedWord = string.Join(" ", word.Select(c => c == ' ' ? " " : "_"));

            await _hubContext.Clients.Client(drawerConnectionId).SendAsync("OnTurnStarted", word);
            
            await _hubContext.Clients.GroupExcept(roomId, new[] { drawerConnectionId }).SendAsync("OnTurnStarted", maskedWord);

            return true;
        }

        public string PickDrawer(string roomId)
        {
            var room = _registryManager.GetRoomByRoomId(roomId);
            var participants = _registryManager.FetchParticipants(roomId);
            participants.Shuffle();
            var drawer = participants[0];
            room.CurrentDrawerId = drawer.ConnectionId;
            return drawer.ConnectionId;
        }
        public List<string> GenerateWords(string roomId)
        {
            var words = _registryManager.FetchWords(roomId);
            words.Shuffle();
            return words.Slice(0,3);

        }

        public void AddWords(string[] words)
        {
            throw new NotImplementedException();
        }

        public List<CanvasUpdate> FetchCanvasUpdates(string roomId)
        {
            return _registryManager.FetchCanvasUpdates(roomId);
        }

        public void AddCanvasUpdate(CanvasUpdate canvasUpdate)
        {
            _registryManager.AddCanvasUpdate(canvasUpdate);
        }
    }
}

using Skribbl.Interfaces;

namespace Skribbl.Models
{
    ///<summary>
    ///Class <c>GameRoom</c>  holds  room state
    ///</summary>
    public class GameState
    {
        private string _id;
        private List<Player> _players;
        private string? _currentWord;

        public string Id
        {
            get => _id;
            set => _id = value;
        }
        public List<Player> Players
        {
            get => _players;
            set => _players = value;
        }
        public string? CurrentWord
        {
            get => _currentWord;
            set => _currentWord = value;
        }

        public GameState(string id)
        {
            _id = id;
            _players = new List<Player>();
            _currentWord = null;
        }

        public int CurrentDrawerId { get; set; }
        public bool IsStarted { get; set; }
    }
}

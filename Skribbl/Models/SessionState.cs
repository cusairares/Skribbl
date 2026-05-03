using Skribbl.Interfaces;

namespace Skribbl.Models
{
    ///<summary>
    ///Class <c>GameRoom</c>  holds  room state
    ///</summary>
    public class SessionState
    {
        private string _id;
        private List<Participant> _players;
        private string? _currentWord;

        public string Id
        {
            get => _id;
            set => _id = value;
        }
        public List<Participant> Players
        {
            get => _players;
            set => _players = value;
        }
        public string? CurrentWord
        {
            get => _currentWord;
            set => _currentWord = value;
        }

        public SessionState(string id)
        {
            _id = id;
            _players = new List<Participant>();
            _currentWord = null;
        }

        public int CurrentDrawerId { get; set; }
        public bool IsStarted { get; set; }
    }
}

using Skribbl.DTO;
using Skribbl.Interfaces;

namespace Skribbl.Models
{
    ///<summary>
    ///Class <c>SessionState</c>  holds  room state
    ///</summary>
    public class SessionState
    {
        private string _id;
        private List<Participant> _participants;
        private List<CanvasUpdate> _canvasUpdates;
        private string? _currentWord;
        private List<string> _wordList = new List<string> { "ana", "are", "mere"};

        public string Id
        {
            get => _id;
            set => _id = value;
        }
        public List<string> WordList
        {
            get => _wordList;
        }

        public List<Participant> Participants
        {
            get => _participants;
            set => _participants = value;
        }

        public List<CanvasUpdate> CanvasUpdates
        {
            get => _canvasUpdates;
            set => _canvasUpdates = value;
        }
        public string? CurrentWord
        {
            get => _currentWord;
            set => _currentWord = value;
        }

        public SessionState(string id)
        {
            _id = id;
            _participants = new List<Participant>();
            _currentWord = null;
            _canvasUpdates = new List<CanvasUpdate>();
        }

        public int CurrentDrawerId { get; set; }
        public bool IsStarted { get; set; }
    }
}

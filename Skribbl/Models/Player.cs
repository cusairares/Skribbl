namespace Skribbl.Models
{
    public class Player
    {
        private string _username;
        private int _score;
        private string _connectionId;


        public string Username
        {
            get=> _username;
            set => _username = value;
        }
        public int Score
        {
            get => _score;
            set => _score = value;
        }

        public string ConnectionId
        {
            get => _connectionId;
            set => _connectionId = value;
        }

        public Player(string username, int score)
        {
            _username = username;
            _score = score;
        }


    }
}

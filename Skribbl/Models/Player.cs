namespace Skribbl.Models
{
    public class Player
    {
        public required string Username { get; set; } = string.Empty;
        public required string ConnectionId { get; set; } = string.Empty;
        public int Score { get; set; }

        public Player() { }

    }
}

using System.Text.Json.Serialization;

namespace Skribbl.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ChatMessageType
    {
        Default,
        CorrectGuess
    }
}

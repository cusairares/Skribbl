namespace Skribbl.DTO
{
    public record CanvasUpdate(string RoomId, double X, double Y, bool IsNewStroke, string Color, int Width);
}

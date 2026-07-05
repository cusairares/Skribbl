using System.Collections.Generic;

namespace Skribbl.DTO
{
    public record RoundPayload(string DrawerConnectionId, List<string> Words);
}

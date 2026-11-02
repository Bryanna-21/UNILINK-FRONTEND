import ToolsHub from "../../components/ToolsHub";
import { ADMIN_TOOL_GROUPS } from "../../constants/toolHubs";

export default function AdminTools() {
  return (
    <ToolsHub
      title="Admin Tools"
      intro="People, safety and oversight for your university."
      groups={ADMIN_TOOL_GROUPS}
    />
  );
}

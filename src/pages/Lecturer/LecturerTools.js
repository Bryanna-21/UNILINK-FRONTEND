import ToolsHub from "../../components/ToolsHub";
import { LECTURER_TOOL_GROUPS } from "../../constants/toolHubs";

export default function LecturerTools() {
  return (
    <ToolsHub
      title="Lecturer Tools"
      intro="Your courses, coursework and everything you need to teach."
      groups={LECTURER_TOOL_GROUPS}
    />
  );
}

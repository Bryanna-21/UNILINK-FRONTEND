import { useCallback, useEffect, useState } from "react";
import courseService from "../services/courseService";
import { getErrorMessage } from "../utils/errors";

// The courses (units) the signed-in user belongs to: a student's
// enrolled units, a lecturer's own, as scoped by GET /courses.
export default function useMyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await courseService.getCourses();
      setCourses(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setCourses([]);
      setError(getErrorMessage(err, "We couldn't load your units."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { courses, loading, error, reload: load };
}

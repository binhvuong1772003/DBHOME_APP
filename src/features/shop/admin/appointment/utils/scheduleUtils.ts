export function parseTimeToMinutes(value: string | null | undefined): number | null {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return null;

  const [hours, minutes] = value.split(":").map(Number);
  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

export function formatTimeLabel(minutes: number | null | undefined): string {
  if (typeof minutes !== "number" || !Number.isFinite(minutes)) return "—";

  const normalized = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getAppointmentDurationMinutes(
  startTime: string,
  endTime: string,
): number | null {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (start === null || end === null) return null;

  const duration = end - start;
  return duration > 0 ? duration : null;
}

export function getOverlappingAppointmentLayout<T extends { id: string; startTime: string; endTime: string }>(
  appointments: T[],
): Map<string, { column: number; columns: number }> {
  const entries = appointments
    .map((appointment) => ({
      appointment,
      start: parseTimeToMinutes(appointment.startTime),
      end: parseTimeToMinutes(appointment.endTime),
    }))
    .filter(
      (entry): entry is typeof entry & { start: number; end: number } =>
        entry.start !== null && entry.end !== null && entry.end > entry.start,
    )
    .sort((a, b) => a.start - b.start || a.end - b.end);
  const layout = new Map<string, { column: number; columns: number }>();
  let index = 0;

  while (index < entries.length) {
    const group = [entries[index]];
    let groupEnd = entries[index].end;
    let cursor = index + 1;
    while (cursor < entries.length && entries[cursor].start < groupEnd) {
      group.push(entries[cursor]);
      groupEnd = Math.max(groupEnd, entries[cursor].end);
      cursor += 1;
    }

    const active: Array<{ end: number; column: number }> = [];
    let maxColumns = 1;
    group.forEach((entry) => {
      for (let column = 0; ; column += 1) {
        if (!active.some((item) => item.end > entry.start && item.column === column)) {
          active.push({ end: entry.end, column });
          maxColumns = Math.max(maxColumns, column + 1);
          layout.set(entry.appointment.id, { column, columns: 1 });
          break;
        }
      }
    });
    group.forEach((entry) => {
      const item = layout.get(entry.appointment.id);
      if (item) layout.set(entry.appointment.id, { ...item, columns: maxColumns });
    });
    index = cursor;
  }

  return layout;
}

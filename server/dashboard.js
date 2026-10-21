function uniqueBy(rows, keyFactory) {
  return [...new Map(rows.map((row) => [keyFactory(row), row])).values()];
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asBoolean(value) {
  if (typeof value === "boolean") return value;
  return ["true", "1", "ativo", "sim"].includes(String(value || "").trim().toLowerCase());
}

function apiRange(start, end) {
  return {
    start: start || "2000-01-01T00:00:00",
    end: end || new Date().toISOString(),
  };
}

export async function loadDashboardBase(client, { start, end }) {
  const range = apiRange(start, end);
  const commonPeriod = { DataInicio: range.start, DataFim: range.end };

  const [userRows, courseRows, enrollmentRows, trailRows, meetingRows, certificateRows] =
    await Promise.all([
      client.get("/api/usuarios/getAll", { Inicio: range.start, Fim: range.end }),
      client.get("/api/cursos/GetCursos"),
      client.get("/api/relatorios/cursos", commonPeriod),
      client.get("/api/trilhas"),
      client.get("/api/meetings"),
      client.get("/api/Certificacoes/Realizadas", commonPeriod),
    ]);

  const users = uniqueBy(asArray(userRows), (row) => row.ID ?? row.id);
  const courses = uniqueBy(asArray(courseRows), (row) => row.CursoID ?? row.id);
  const enrollments = uniqueBy(
    asArray(enrollmentRows),
    (row) => `${row.UsuarioID}:${row.CursoID}:${row.TurmaID}`,
  );
  const trails = uniqueBy(asArray(trailRows), (row) => row.TrilhaId ?? row.id);
  const meetings = uniqueBy(asArray(meetingRows), (row) => row.id ?? row.ID);
  const certifications = asArray(certificateRows);

  const activeUsers = users.filter((row) => asBoolean(row.UsuarioAtivo) && !asBoolean(row.UsuarioBloqueado));
  const blockedUsers = users.filter((row) => asBoolean(row.UsuarioBloqueado));
  const completed = enrollments.filter((row) => asBoolean(row.UsuarioCursoFinalizado));
  const issued = certifications.filter((row) => asBoolean(row.Certificado));
  const progressTotal = enrollments.reduce(
    (sum, row) => sum + Math.max(0, Math.min(100, Number(row.UsuarioCursoProgresso) || 0)),
    0,
  );

  return {
    live: true,
    fetchedAt: new Date().toISOString(),
    counts: {
      users: users.length,
      activeUsers: activeUsers.length,
      inactiveUsers: Math.max(0, users.length - activeUsers.length - blockedUsers.length),
      blockedUsers: blockedUsers.length,
      courses: courses.length,
      enrollments: enrollments.length,
      completedEnrollments: completed.length,
      trails: trails.length,
      activeTrails: trails.filter((row) => asBoolean(row.TrilhaAtiva)).length,
      meetings: meetings.length,
      certifications: certifications.length,
      issuedCertifications: issued.length,
      completionRate: enrollments.length ? (completed.length / enrollments.length) * 100 : 0,
      averageProgress: enrollments.length ? progressTotal / enrollments.length : 0,
    },
    users,
    courses,
    enrollments,
    trails,
    meetings,
    certifications: { records: certifications },
  };
}

export async function loadDashboardQuestions(client, { start, end }) {
  const range = apiRange(start, end);
  const [exams, answers] = await Promise.all([
    client.get("/api/provas/GetAll"),
    client.get("/api/provas/PerguntasRespostas", { Inicio: range.start, Fim: range.end }),
  ]);
  return { live: true, fetchedAt: new Date().toISOString(), exams: asArray(exams), answers: asArray(answers) };
}

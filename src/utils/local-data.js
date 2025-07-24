let notes = [
  {
    id: "notes-1",
    title: "Babel",
    body: "Babel merupakan tools open-source yang digunakan untuk mengubah sintaks ECMAScript 2015+ menjadi sintaks yang didukung oleh JavaScript engine versi lama. Babel sering dipakai ketika kita menggunakan sintaks terbaru termasuk sintaks JSX.",
    createdAt: "2022-04-14T04:27:34.572Z",
    archived: false,
  },
  {
    id: "notes-2",
    title: "Functional Component",
    body: "Functional component merupakan React component yang dibuat menggunakan fungsi JavaScript. Agar fungsi JavaScript dapat disebut component ia harus mengembalikan React element dan dipanggil layaknya React component.",
    createdAt: "2022-04-14T04:27:34.572Z",
    archived: false,
  },
  {
    id: "notes-3",
    title: "Modularization",
    body: "Dalam konteks pemrograman JavaScript, modularization merupakan teknik dalam memecah atau menggunakan kode dalam berkas JavaScript secara terpisah berdasarkan tanggung jawabnya masing-masing.",
    createdAt: "2022-04-14T04:27:34.572Z",
    archived: false,
  },
  {
    id: "notes-4",
    title: "Lifecycle",
    body: "Dalam konteks React component, lifecycle merupakan kumpulan method yang menjadi siklus hidup mulai dari component dibuat (constructor), dicetak (render), pasca-cetak (componentDidMount), dan sebagainya. ",
    createdAt: "2022-04-14T04:27:34.572Z",
    archived: false,
  },
  {
    id: "notes-5",
    title: "ESM",
    body: "ESM (ECMAScript Module) merupakan format modularisasi standar JavaScript.",
    createdAt: "2022-04-14T04:27:34.572Z",
    archived: false,
  },
  {
    id: "notes-6",
    title: "Module Bundler",
    body: "Dalam konteks pemrograman JavaScript, module bundler merupakan tools yang digunakan untuk menggabungkan seluruh modul JavaScript yang digunakan oleh aplikasi menjadi satu berkas.",
    createdAt: "2022-04-14T04:27:34.572Z",
    archived: false,
  },
];

function getAllNotes() {
  return notes;
}

function getNote(id) {
  const foundedNote = notes.find((note) => note.id === id);
  return foundedNote;
}

function getActiveNotes() {
  const activeNotes = notes.filter((note) => !note.archived);
  return activeNotes;
}

function getArchivedNotes() {
  const archivedNotes = notes.filter((note) => note.archived);
  return archivedNotes;
}

function addNote({ title, body }) {
  notes = [
    ...notes,
    {
      id: `notes-${+new Date()}`,
      title: title || "(untitled)",
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    },
  ];
}

// --- EVENT DATA & FUNCTIONS ---
let events = [
  {
    id: "1",
    name: "Seminar Teknologi AI",
    description: "Seminar membahas perkembangan terbaru dalam teknologi AI.",
    date: "2025-08-10",
    location: "Jakarta",
    organizer: "Dicoding",
    capacity: 100,
    category: "Seminar",
    status: "Aktif",
  },
  {
    id: "2",
    name: "Workshop React",
    description: "Workshop intensif membangun aplikasi dengan React.",
    date: "2025-09-05",
    location: "Bandung",
    organizer: "React Indonesia",
    capacity: 50,
    category: "Workshop",
    status: "Aktif",
  },
  {
    id: "3",
    name: "Kompetisi Coding",
    description: "Kompetisi coding untuk pelajar dan mahasiswa.",
    date: "2025-10-15",
    location: "Surabaya",
    organizer: "Komunitas IT",
    capacity: 200,
    category: "Kompetisi",
    status: "Aktif",
  },
];

function getAllEvents() {
  return [...events];
}

function getEvent(id) {
  return events.find((event) => event.id === id);
}

function addEvent(event) {
  const newEvent = {
    ...event,
    id: (+new Date()).toString(),
    status: "Aktif",
  };
  events.push(newEvent);
  return newEvent;
}

function updateEvent(id, updatedEvent) {
  const idx = events.findIndex((event) => event.id === id);
  if (idx !== -1) {
    events[idx] = { ...events[idx], ...updatedEvent };
    return events[idx];
  }
  return null;
}

function deleteEvent(id) {
  events = events.filter((event) => event.id !== id);
}

function getEventsByCategory(category) {
  return events.filter((event) => event.category === category);
}

function getUpcomingEvents() {
  const now = new Date();
  return events.filter((event) => new Date(event.date) > now);
}
// --- PARTICIPANT DATA & FUNCTIONS ---
let participants = [
  {
    id: "p1",
    name: "Andi Wijaya",
    dob: "1990-05-12",
    email: "andi.wijaya@email.com",
    phone: "081234567890",
    eventId: "1",
    registrationDate: "2025-07-01",
    status: "Registered",
    checkUpStatus: "Completed",
    checkUpDetails: {
      bloodPressure: "120/80",
      temperature: 36.7,
      heartRate: 75,
      weight: 68,
      allergies: "None",
      medications: "None",
      notes: "Healthy",
      checkUpDate: "2025-07-10",
      doctorName: "Dr. Siti Nurhaliza",
    },
    checkUpHistory: [
      {
        bloodPressure: "118/78",
        temperature: 36.5,
        heartRate: 72,
        weight: 67,
        allergies: "None",
        medications: "None",
        notes: "Healthy, no issues.",
        checkUpDate: "2025-06-10",
        doctorName: "Dr. Siti Nurhaliza",
      },
    ],
  },
  {
    id: "p3",
    name: "Siti Aminah",
    dob: "1985-11-23",
    email: "siti.aminah@email.com",
    phone: "081345678901",
    eventId: "1",
    registrationDate: "2025-07-03",
    status: "Registered",
    checkUpStatus: "Pending",
    checkUpDetails: null,
    checkUpHistory: [],
  },
  {
    id: "p4",
    name: "Rudi Hartono",
    dob: "1992-02-17",
    email: "rudi.hartono@email.com",
    phone: "081356789012",
    eventId: "1",
    registrationDate: "2025-07-04",
    status: "Registered",
    checkUpStatus: "In Progress",
    checkUpDetails: {
      bloodPressure: "140/90",
      temperature: 37.2,
      heartRate: 90,
      weight: 80,
      allergies: "Penicillin",
      medications: "Amlodipine",
      notes: "High blood pressure, under medication.",
      checkUpDate: "2025-07-11",
      doctorName: "Dr. Budi Prasetyo",
    },
    checkUpHistory: [],
  },
  {
    id: "p5",
    name: "Maria Fransiska",
    dob: "1995-08-30",
    email: "maria.fransiska@email.com",
    phone: "081367890123",
    eventId: "1",
    registrationDate: "2025-07-05",
    status: "Registered",
    checkUpStatus: "Completed",
    checkUpDetails: {
      bloodPressure: "110/70",
      temperature: 36.2,
      heartRate: 65,
      weight: 55,
      allergies: "Seafood",
      medications: "None",
      notes: "Allergic to seafood, otherwise healthy.",
      checkUpDate: "2025-07-12",
      doctorName: "Dr. Siti Nurhaliza",
    },
    checkUpHistory: [
      {
        bloodPressure: "112/72",
        temperature: 36.3,
        heartRate: 66,
        weight: 56,
        allergies: "Seafood",
        medications: "None",
        notes: "No issues, allergy noted.",
        checkUpDate: "2025-06-12",
        doctorName: "Dr. Siti Nurhaliza",
      },
    ],
  },
  {
    id: "p6",
    name: "Dewi Lestari",
    dob: "1988-03-15",
    email: "dewi.lestari@email.com",
    phone: "081378901234",
    eventId: "1",
    registrationDate: "2025-07-06",
    status: "Registered",
    checkUpStatus: "Completed",
    checkUpDetails: {
      bloodPressure: "125/85",
      temperature: 36.8,
      heartRate: 80,
      weight: 62,
      allergies: "None",
      medications: "None",
      notes: "Healthy, regular check-up.",
      checkUpDate: "2025-07-13",
      doctorName: "Dr. Budi Prasetyo",
    },
    checkUpHistory: [],
  },
  {
    id: "p2",
    name: "Budi Santoso",
    dob: "1993-09-09",
    email: "budi.santoso@email.com",
    phone: "081298765432",
    eventId: "2",
    registrationDate: "2025-07-02",
    status: "Registered",
    checkUpStatus: "Pending",
    checkUpDetails: null,
    checkUpHistory: [],
  },
];

function getAllParticipants() {
  return [...participants];
}

function getParticipant(id) {
  return participants.find((p) => p.id === id);
}

function getParticipantsByEvent(eventId) {
  return participants.filter((p) => p.eventId === eventId);
}

function addParticipant(participant) {
  const newParticipant = {
    ...participant,
    id: (+new Date()).toString(),
    registrationDate: new Date().toISOString().slice(0, 10),
    status: "Registered",
    checkUpStatus: "Pending",
    checkUpDetails: null,
    checkUpHistory: [],
  };
  participants.push(newParticipant);
  return newParticipant;
}

function updateParticipant(id, updatedParticipant) {
  const idx = participants.findIndex((p) => p.id === id);
  if (idx !== -1) {
    participants[idx] = { ...participants[idx], ...updatedParticipant };
    return participants[idx];
  }
  return null;
}

function deleteParticipant(id) {
  participants = participants.filter((p) => p.id !== id);
}

function updateParticipantCheckUp(participantId, checkUpData) {
  const idx = participants.findIndex((p) => p.id === participantId);
  if (idx !== -1) {
    const prevDetails = participants[idx].checkUpDetails;
    if (prevDetails) {
      participants[idx].checkUpHistory.push(prevDetails);
    }
    participants[idx].checkUpDetails = checkUpData;
    participants[idx].checkUpStatus = "Completed";
    return participants[idx];
  }
  return null;
}

function getParticipantCheckUpHistory(participantId) {
  const participant = participants.find((p) => p.id === participantId);
  return participant ? participant.checkUpHistory : [];
}
// --- END PARTICIPANT DATA & FUNCTIONS ---

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
}

function archiveNote(id) {
  notes = notes.map((note) => {
    if (note.id === id) {
      return { ...note, archived: true };
    }
    return note;
  });
}

function unarchiveNote(id) {
  notes = notes.map((note) => {
    if (note.id === id) {
      return { ...note, archived: false };
    }

    return note;
  });
}

function editNote({ id, title, body }) {
  const noteToEdit = notes.find((note) => note.id === id);
  noteToEdit.title = title;
  noteToEdit.body = body;

  notes = notes.map((note) => {
    if (note.id === id) {
      return note;
    }
    return note;
  });
}

export {
  getAllNotes,
  getActiveNotes,
  getArchivedNotes,
  deleteNote,
  editNote,
  getNote,
  archiveNote,
  unarchiveNote,
  addNote,
  // Event exports
  getAllEvents,
  getEvent,
  addEvent,
  updateEvent,
  deleteEvent,
  getEventsByCategory,
  getUpcomingEvents,
  // Participant exports
  getAllParticipants,
  getParticipant,
  getParticipantsByEvent,
  addParticipant,
  updateParticipant,
  deleteParticipant,
  updateParticipantCheckUp,
  getParticipantCheckUpHistory,
};

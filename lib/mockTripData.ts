export type MockMemberRole = "owner" | "member";

export type MockTripMember = {
  id: string;
  name: string;
  handle?: string;
  email: string;
  role: MockMemberRole;
  initials: string;
  tone: "coral" | "pine" | "sand" | "blue";
};

export type MockInvitableUser = {
  id: string;
  name: string;
  email: string;
  handle: string;
  initials: string;
  tone: "coral" | "pine" | "sand" | "blue";
  status: "already_member" | "invited" | "available";
};

export type MockTripInvitation = {
  id: string;
  tripName: string;
  invitedBy: {
    name: string;
    initials: string;
    tone: "coral" | "pine" | "sand" | "blue";
  };
  destination: string;
  date: string;
  budget?: string;
  status: "pending" | "accepted" | "declined";
};

export type MockTripDetail = {
  id: string;
  title: string;
  destination: string;
  dates: string;
  budget: string;
  members: MockTripMember[];
  itinerary: {
    day: string;
    title: string;
    description: string;
    time?: string;
    tag?: string;
  }[];
};

export const INITIAL_SAMPLE_TRIP: MockTripDetail = {
  id: "sample-trip",
  title: "Lonavala Monsoon Escape",
  destination: "Lonavala, Maharashtra",
  dates: "Oct 12 – 14, 2025",
  budget: "₹25,000",
  members: [
    {
      id: "u1",
      name: "Prathamesh",
      handle: "@prathamesh",
      email: "prathamesh@vistara.app",
      role: "owner",
      initials: "PM",
      tone: "coral",
    },
    {
      id: "u2",
      name: "Rahul Kapoor",
      handle: "@rahul.k",
      email: "rahul@example.com",
      role: "member",
      initials: "RK",
      tone: "pine",
    },
    {
      id: "u3",
      name: "Sneha Rao",
      handle: "@sneha.r",
      email: "sneha@example.com",
      role: "member",
      initials: "SR",
      tone: "blue",
    },
  ],
  itinerary: [
    {
      day: "Day 01",
      title: "Scenic drive & Tiger Point sunset",
      description: "Meet up early for the Western Ghats drive. Catch monsoon mist and chai at Tiger Point before settling into the villa.",
      time: "10:00 AM",
      tag: "Nature & Views",
    },
    {
      day: "Day 02",
      title: "Pawna Lake picnic & heritage walk",
      description: "Leisurely afternoon picnic by Pawna Lake waters with local snacks. Evening heritage stroll near Karla Caves.",
      time: "01:30 PM",
      tag: "Adventure",
    },
    {
      day: "Day 03",
      title: "Café breakfast & return journey",
      description: "Slow breakfast at an open-air café in town, picking up traditional fudge & chikki on the way home.",
      time: "09:30 AM",
      tag: "Food & Relaxation",
    },
  ],
};

export const INITIAL_INVITABLE_USERS: MockInvitableUser[] = [
  {
    id: "inv-1",
    name: "Prathamesh",
    handle: "@prathamesh",
    email: "prathamesh@vistara.app",
    initials: "PM",
    tone: "coral",
    status: "already_member",
  },
  {
    id: "inv-2",
    name: "Rahul",
    handle: "@rahul.k",
    email: "rahul@example.com",
    initials: "RK",
    tone: "pine",
    status: "already_member",
  },
  {
    id: "inv-3",
    name: "Sneha",
    handle: "@sneha.r",
    email: "sneha@example.com",
    initials: "SR",
    tone: "blue",
    status: "already_member",
  },
  {
    id: "inv-4",
    name: "Aditya",
    handle: "@aditya.v",
    email: "aditya@example.com",
    initials: "AV",
    tone: "sand",
    status: "available",
  },
  {
    id: "inv-5",
    name: "Priya Shah",
    handle: "@priyashah",
    email: "priya@example.com",
    initials: "PS",
    tone: "blue",
    status: "available",
  },
  {
    id: "inv-6",
    name: "Aarav Mehta",
    handle: "@aaravm",
    email: "aarav@example.com",
    initials: "AM",
    tone: "sand",
    status: "invited",
  },
];

export const INITIAL_TRIP_INVITATIONS: MockTripInvitation[] = [
  {
    id: "inv-trip-1",
    tripName: "Goa Coastal Drift",
    invitedBy: {
      name: "Aditya Verma",
      initials: "AV",
      tone: "sand",
    },
    destination: "North Goa & Palolem",
    date: "Nov 08 – 12, 2025",
    budget: "₹35,000",
    status: "pending",
  },
  {
    id: "inv-trip-2",
    tripName: "Coorg Coffee Estate Trail",
    invitedBy: {
      name: "Sneha Rao",
      initials: "SR",
      tone: "blue",
    },
    destination: "Madikeri, Coorg",
    date: "Dec 05 – 08, 2025",
    budget: "₹20,000",
    status: "pending",
  },
];

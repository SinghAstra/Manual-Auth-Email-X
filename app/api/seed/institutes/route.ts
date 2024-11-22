import { db } from "@/lib/db";
import { InstitutionType } from "@prisma/client";
import { NextResponse } from "next/server";

const instituteNames = [
  "Stanford Technical Institute",
  "Cambridge College of Engineering",
  "Oxford Research Academy",
  "MIT Professional Studies",
  "Berkeley Institute of Technology",
  "Harvard Medical College",
  "Princeton Research Center",
  "Yale Institute of Science",
  "Caltech Engineering School",
  "Johns Hopkins Medical Institute",
  "Northwestern Technical University",
  "Duke College of Sciences",
  "Carnegie Institute of Technology",
  "Columbia Engineering Academy",
  "Cornell Research Institute",
  "Georgia Tech Professional College",
  "Michigan Institute of Technology",
  "Penn State Research Center",
  "Texas Institute of Sciences",
  "UCLA Technical Academy",
  "Virginia Tech Institute",
  "Washington Research College",
  "Wisconsin Institute of Technology",
  "Illinois Technical University",
  "Purdue Engineering Institute",
  "Rochester Institute of Technology",
  "Brown Technical College",
  "Rice Research Academy",
  "Notre Dame Institute",
  "Vanderbilt Technical School",
  "Emory Research Institute",
  "Georgetown College of Science",
  "Boston Technical University",
  "USC Engineering Academy",
  "Tufts Research Institute",
  "NYU Technical College",
  "Dartmouth Institute of Science",
  "Johns Hopkins Engineering",
  "Case Western Research Center",
  "University of Chicago Tech",
];

const cities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "Charlotte, NC",
];

const institutionTypes = ["university", "college", "technical", "research"];

function generatePhone() {
  return `${Math.floor(Math.random() * 900) + 100}-${
    Math.floor(Math.random() * 900) + 100
  }-${Math.floor(Math.random() * 9000) + 1000}`;
}

function generateZipCode() {
  return `${Math.floor(Math.random() * 90000) + 10000}`;
}

function generateAffiliationNumber() {
  return `AFF${Math.floor(Math.random() * 900000) + 100000}`;
}

function generateAddress(city: string) {
  const streetNumbers = Math.floor(Math.random() * 9000) + 1000;
  const streets = [
    "University Avenue",
    "College Drive",
    "Technology Parkway",
    "Research Boulevard",
    "Innovation Drive",
    "Science Way",
    "Academic Circle",
    "Campus Drive",
    "Education Lane",
    "Learning Center Road",
  ];
  const street = streets[Math.floor(Math.random() * streets.length)];
  return `${streetNumbers} ${street}, ${city}`;
}

// Generate a date between 6 months ago and now
function generateDate(index: number, total: number) {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 6);

  // Distribute creation dates evenly across the 6-month period
  const timeSpan = end.getTime() - start.getTime();
  const timePerItem = timeSpan / total;

  // Add some randomness to make it more organic (-2 to +2 days)
  const randomOffset = Math.floor(Math.random() * 4 - 2) * 24 * 60 * 60 * 1000;

  const date = new Date(start.getTime() + timePerItem * index + randomOffset);
  return date;
}

export async function GET() {
  try {
    const institutes = await Promise.all(
      instituteNames.map(async (name, index) => {
        const city = cities[Math.floor(Math.random() * cities.length)];
        const createdAt = generateDate(index, instituteNames.length);
        const updatedAt = new Date(
          createdAt.getTime() + Math.floor(Math.random() * 24 * 60 * 60 * 1000)
        ); // Random update within 24 hours

        const institute = await db.institution.create({
          data: {
            name,
            type: institutionTypes[
              Math.floor(Math.random() * institutionTypes.length)
            ] as InstitutionType,
            establishedYear: Math.floor(Math.random() * (2023 - 1950) + 1950),
            affiliationNumber: generateAffiliationNumber(),
            location: city,
            email: `admissions@${name.toLowerCase().replace(/ /g, "")}.edu`,
            phone: generatePhone(),
            alternatePhone: Math.random() > 0.5 ? generatePhone() : null,
            address: generateAddress(city),
            zipCode: generateZipCode(),
            adminName: [
              "Dr. James Smith",
              "Dr. Maria Garcia",
              "Dr. Robert Johnson",
              "Dr. Sarah Williams",
              "Dr. Michael Brown",
              "Dr. Emily Davis",
              "Dr. David Wilson",
              "Dr. Jennifer Lee",
              "Dr. William Taylor",
              "Dr. Elizabeth Anderson",
            ][Math.floor(Math.random() * 10)],
            adminDesignation: [
              "Dean of Admissions",
              "Director of Operations",
              "Chief Academic Officer",
              "Executive Director",
              "Administrative Dean",
              "Head of Institution",
              "Principal",
              "Vice Chancellor",
              "Academic Director",
              "Institute Secretary",
            ][Math.floor(Math.random() * 10)],
            createdAt,
            updatedAt,
            documents: {
              create: {
                affiliationCertificate: `https://storage.example.com/documents/${generateAffiliationNumber()}/affiliation.pdf`,
                governmentRecognition: `https://storage.example.com/documents/${generateAffiliationNumber()}/recognition.pdf`,
                letterhead: `https://storage.example.com/documents/${generateAffiliationNumber()}/letterhead.pdf`,
              },
            },
          },
        });

        return institute;
      })
    );

    return NextResponse.json({
      message: `Successfully seeded ${institutes.length} institutes`,
      count: institutes.length,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed institutes" },
      { status: 500 }
    );
  }
}

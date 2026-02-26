# **App Name**: EduCard Sync

## Core Features:

- Student Card Generation & Public Verification: Generate print-ready student cards (front and back) with dynamic QR codes. Includes a public verification page accessible via QR code for card authenticity and status, displaying limited non-sensitive information.
- Daily Attendance Scan System: Officer module for scanning student QR/Barcodes using a mobile device's camera. Validates student cards (active, not expired), logs attendance, and prevents duplicate entries per session.
- Exam Card Management & Generation: Admin can define exam events and generate printable exam cards for students. Features include template selection, live preview, simple editing of content, and mass generation for classes.
- Template Configuration for Cards: A dedicated Template Manager module for administrators to create, edit, and activate templates for both Student Cards and Exam Cards. Allows upload of school assets (logos, signatures, stamps) and simple element adjustments with a live preview.
- Centralized School Settings: Admin dashboard for configuring all school identity details: name, address, contact, main logos, principal's details, signature/stamp images, customizable student card terms of use, and card validity periods.
- Student Data & Bulk Import: Complete CRUD functionality for student data. Supports mass import of student records via Excel (.xlsx) and CSV files, including column mapping, validation, and a summary of import results.
- AI-Assisted Card Terminology Refinement: An AI tool to help the administrator refine the 'Ketentuan Pengguna Kartu' text. This tool can suggest improvements for clarity, conciseness, or tone while ensuring the intended message remains intact.

## Style Guidelines:

- Primary color: A stable and professional deep blue (#2E50B8), signifying trust and educational values, suitable for prominent interactive elements and branding.
- Background color: A very light, desaturated blue (#ECF0F8), providing a clean, open, and serene backdrop that is easy on the eyes for extended use.
- Accent color: A vibrant aqua-cyan (#4FBFDD), serving as a refreshing counterpoint to the primary blue. Used to highlight critical information, active states, and calls to action.
- Headline and Body text font: 'Inter' (sans-serif) for its modern, highly legible, and neutral aesthetic, ensuring clear presentation of all data and content across the application.
- Utilize a consistent set of clean, simple, and flat line-based icons to maintain a professional and uncluttered user interface, facilitating quick visual recognition of features.
- Emphasize a mobile-first responsive layout, optimizing usability on small screens for scanner personnel. Admin and desktop users will benefit from a structured layout with clear navigation (sidebar) and efficient data display.
- Incorporate subtle and quick animations for feedback, such as confirmation on successful QR scans or brief transitions during navigation and data updates, enhancing user interaction without distraction.
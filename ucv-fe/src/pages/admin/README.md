# UCV Admin Panel

This admin panel allows you to manage the content of the Universal Connect Vietnam website. You can edit text, update images, and modify statistics directly through this interface.

## Features

- Edit all content elements (headings, paragraphs, buttons, images, statistics)
- Live preview of changes
- Persistent storage of content (using localStorage)
- Responsive design for desktop and mobile editing

## Page Structure

The admin panel is organized by pages, with each page containing multiple sections:

- **Home**: Edit hero banner, about us section, statistics
- **About Us**: Update company information, history, team details
- **Our Tours**: Manage tour listings, categories, featured tours
- **Tour Details**: Edit individual tour descriptions, itineraries, pricing

## How to Use

1. Navigate to the admin panel by visiting `/admin` in your browser
2. Select the page you want to edit
3. Find the content element you want to modify
4. Click "Edit" to make changes
5. Save your changes
6. View the website to see your updates live

## Technical Notes

The admin panel uses:

- Zustand for state management
- localStorage for persistent storage
- React Router for navigation

## Dependencies

Make sure you have the following dependencies installed:

```bash
npm install zustand
``` 
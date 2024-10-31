/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ECF0F1', // Main background color
        navbar: '#F7F9FB', // Navbar background color
        sidenav: '#2C3E50', // Side navbar background (bg-gray-900)
        sidenavtext: '#ECF0F1',
        navbartext: '#FFFFFF', // White text for navbar
        primarybutton: '#007BFF', // Vibrant Blue for primary buttons
        secondarybutton: '#007B7F', // Dark Cyan for secondary buttons
        buttontext: '#FFFFFF', // White text for buttons
        text: '#D3D3D3', // Light Gray for general text
        highlighttext: '#FFFFFF', // White for headings or important text
        border: '#444444', // Dark Gray for borders and dividers
        buttonhover: '#0056b3', // Button hover color
        navbarhover: '#0056b3', // Navbar link hover color
        formbackground: '#F7F9FB ', // Form background color
        chartbackground: '#292929', // Chart background color
      },
      height: {
        '50': '12.5rem',   
        '75': '18.75rem',  
        '100': '25rem',    
        '125': '31.25rem', 
        '150': '37.5rem',  
        '200': '50rem',    
        '250': '62.5rem',  
        '300': '75rem',    
      },
      width: {
        '50': '12.5rem',   
        '75': '18.75rem',  
        '100': '25rem',    
        '125': '31.25rem', 
        '150': '37.5rem',  
        '200': '50rem',    
        '250': '62.5rem',  
        '300': '75rem',
        '350': '87.5rem',    
        '400': '100rem',
      }
    },
  },
  plugins: [],
}
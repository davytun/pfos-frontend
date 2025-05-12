# Projects Slider Configuration

This document explains how to add, modify, or remove projects from the projects slider on the homepage.

## How It Works

The projects slider now uses a JSON data file to dynamically load content. This makes it easy to update the slider without modifying HTML code.

## JSON Data File Location

The projects data is stored in:
```
assets/js/projects-data.json
```

## JSON Structure

Each project in the slider has the following structure:

```json
{
  "image": "path/to/image.png",
  "title": "Project Title",
  "date": "Project Date"
}
```

## How to Add a New Project

1. Open the `assets/js/projects-data.json` file
2. Add a new JSON object to the array with the required fields:

```json
{
  "image": "assets/images/your-new-image.png",
  "title": "Your New Project Title",
  "date": "Project Date"
}
```

3. Make sure to place your image file in the specified path

## How to Modify an Existing Project

1. Open the `assets/js/projects-data.json` file
2. Find the project you want to modify
3. Update the values as needed

## How to Remove a Project

1. Open the `assets/js/projects-data.json` file
2. Find the project you want to remove
3. Delete the entire JSON object for that project, including the surrounding curly braces
4. Make sure to remove the comma after the previous project if the removed project was not the last one

## Example

```json
[
  {
    "image": "assets/images/projects1.png",
    "title": "36KW Solar Inverter System",
    "date": "May 30, 2021"
  },
  {
    "image": "assets/images/projects2.png",
    "title": "24KW Solar Inverter System",
    "date": "June 15, 2021"
  }
]
```

## Troubleshooting

If the slider doesn't display correctly after modifying the JSON file, check for:

1. Valid JSON format (no missing commas, brackets, etc.)
2. Correct image paths
3. Browser console errors
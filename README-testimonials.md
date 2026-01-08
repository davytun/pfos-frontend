# Testimonials Slider Configuration

This document explains how to add, modify, or remove testimonials from the testimonials slider on the homepage.

## How It Works

The testimonials slider now uses a JSON data file to dynamically load content. This makes it easy to update the slider without modifying HTML code.

The testimonials are displayed as follows:
- On desktop (screens larger than 640px): 2 testimonials are shown at a time
- On mobile (screens smaller than 640px): 1 testimonial is shown at a time

## JSON Data File Location

The testimonials data is stored in:
```
assets/js/testimonials-data.json
```

## JSON Structure

Each testimonial in the slider has the following structure:

```json
{
  "name": "Person's Name",
  "position": "Person's Position/Title",
  "testimonial": "The testimonial text goes here."
}
```

## How to Add a New Testimonial

1. Open the `assets/js/testimonials-data.json` file
2. Add a new JSON object to the array with the required fields:

```json
{
  "name": "New Client Name",
  "position": "Client Position",
  "testimonial": "Your new testimonial text goes here."
}
```

## How to Modify an Existing Testimonial

1. Open the `assets/js/testimonials-data.json` file
2. Find the testimonial you want to modify
3. Update the values as needed

## How to Remove a Testimonial

1. Open the `assets/js/testimonials-data.json` file
2. Find the testimonial you want to remove
3. Delete the entire JSON object for that testimonial, including the surrounding curly braces
4. Make sure to remove the comma after the previous testimonial if the removed testimonial was not the last one

## Example

```json
[
  {
    "name": "Mr. Oloyede Emmanuel",
    "position": "Secondary School Teacher",
    "testimonial": "I am very happy with the solar installation. It works well and helps me save on fuel. My family can now read and sleep in comfort without power problems."
  },
  {
    "name": "Mr. Yomi Ogunsami",
    "position": "Civil Engineer",
    "testimonial": "The solar system was installed quickly and works perfectly. I no longer worry about blackouts, and it powers all my tools when I work from home."
  }
]
```

## Troubleshooting

If the slider doesn't display correctly after modifying the JSON file, check for:

1. Valid JSON format (no missing commas, brackets, etc.)
2. Browser console errors
3. Make sure all required fields (name, position, testimonial) are included for each entry

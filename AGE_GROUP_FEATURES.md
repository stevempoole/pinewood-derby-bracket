# Age Group & Racer Management Features

This document describes the new age group management and racer import/export features added to the Pinewood Derby Tournament Bracket application.

## New Features Overview

### 1. Age Group Management
- **Age Group Field**: All racers now have an optional age group field
- **Visual Indicators**: Age groups are displayed with color-coded badges on racer cards
- **Filtering**: Filter racer display by age group using the dropdown filter
- **Statistics**: View count statistics for each age group
- **Auto-Tournament Creation**: Create separate tournaments for each age group with sufficient participants (4+ racers)

### 2. Racer Import/Reload System
- **Bulk Import**: Import racer lists from CSV or JSON files
- **Template Download**: Download sample CSV/JSON templates for proper formatting
- **Reload Last Import**: Restore racers from the most recent import
- **Format Support**: Supports both CSV and JSON file formats

### 3. Enhanced Tournament Management
- **Create by Age Group**: Automatically create tournaments grouped by age divisions
- **Export with Age Groups**: Tournament exports now include age group information
- **Age Group Assignment**: Bulk assign age groups to racers without age groups

## User Interface Changes

### Tournament Management Section
- **🎯 Create Tournaments by Age Group**: Creates separate tournaments for each age group (requires 4+ racers per group)
- **👥 Import Racers**: Import racer lists from CSV/JSON files
- **📋 Download Template**: Download template files for proper import formatting

### Racer Setup Section
- **Age Group Selector**: Dropdown menu when adding individual racers with common Cub Scout divisions:
  - Tigers (Kindergarten)
  - Wolves (1st Grade)  
  - Bears (2nd Grade)
  - Webelos (3rd-4th Grade)
  - Arrow of Light (5th Grade)
  - Scouts BSA (6th-12th Grade)
  - Adults
  - Open Division

- **🔄 Reload Last Import**: Restore racers from the most recent bulk import
- **Age Group Filter**: Filter displayed racers by age group
- **Bulk Assign**: Assign age groups to multiple racers at once
- **Age Group Statistics**: See counts for each age group

## How to Use

### Setting Up Age Groups
1. **Individual Entry**: Select age group when adding each racer
2. **Bulk Import**: Use CSV/JSON import with age group data
3. **Bulk Assignment**: Use "Bulk Assign" to assign age groups to multiple racers

### Importing Racers
1. Click **"👥 Import Racers"** 
2. Choose CSV or JSON file with racer data
3. File should include `name` and `ageGroup` columns/fields
4. Use **"📋 Download Template"** for properly formatted examples

### Creating Age Group Tournaments
1. Ensure racers have age groups assigned
2. Click **"🎯 Create Tournaments by Age Group"**
3. System automatically creates tournaments for age groups with 4+ racers
4. Each tournament is named with the age group (e.g., "Tigers Division")

### File Formats

#### CSV Format
```csv
name,ageGroup
John Doe,Tigers
Jane Smith,Wolves
Mike Johnson,Bears
Sarah Wilson,Webelos
```

#### JSON Format
```json
{
  "racers": [
    { "name": "John Doe", "ageGroup": "Tigers" },
    { "name": "Jane Smith", "ageGroup": "Wolves" },
    { "name": "Mike Johnson", "ageGroup": "Bears" },
    { "name": "Sarah Wilson", "ageGroup": "Webelos" }
  ]
}
```

## Visual Indicators

### Age Group Color Coding
- **Tigers**: Pink/Purple badges
- **Wolves**: Green badges  
- **Bears**: Orange badges
- **Webelos**: Blue badges
- **Arrow of Light**: Light green badges
- **Scouts BSA**: Purple badges
- **Adults**: Pink badges
- **Open**: Pink badges
- **No Age Group**: Red "No Age Group" badge

### Filtering and Display
- Use the age group filter to view racers by division
- Age group statistics show counts for each division
- Filter status displays when viewing subset of racers

## Workflow Example

1. **Prepare Racer List**: Create CSV/JSON file with names and age groups
2. **Import Racers**: Use "Import Racers" to bulk load the list
3. **Review & Adjust**: Check imported racers, assign missing age groups
4. **Create Tournaments**: Use "Create Tournaments by Age Group" to auto-generate divisions
5. **Run Tournaments**: Switch between tournaments using the tournament selector

## Technical Notes

- Age group data is included in tournament exports for backup/sharing
- Last import is cached for easy reload functionality
- Backwards compatible with existing tournaments (age groups optional)
- Mobile-responsive design supports age group features on all devices
- Age groups are preserved when cloning tournaments

## Benefits

- **Organized Competition**: Separate age-appropriate divisions
- **Efficient Setup**: Bulk import reduces manual entry time
- **Easy Management**: Visual indicators and filtering for large groups
- **Flexible Organization**: Support for various scouting levels and custom divisions
- **Data Backup**: Export/import preserves all age group information
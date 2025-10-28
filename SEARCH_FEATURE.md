# Search Feature Documentation

## Overview

Enhanced search functionality that supports both Chinese and English word searching with flexible matching on the favorites page.

## Features

### 1. **Multi-language Support**
- Supports searching in Chinese characters
- Supports searching in English words
- Case-insensitive search
- Partial word matching

### 2. **Search Capabilities**
- **Title Search**: Search by course title (Chinese or English)
- **Level Search**: Search by course level (初級, 中級, 高級)
- **Prefix Matching**: Find courses by typing the first few characters
- **Instant Results**: Real-time search as you type

### 3. **Flexible Matching**
- Works with any part of the course title
- Supports partial word matching
- Finds matches anywhere in the title
- Ignores case differences

## How to Use

### Basic Search
1. Type in the search box at the top of the favorites page
2. Results appear instantly as you type
3. Press Enter to search (optional)

### Search Examples

**Chinese Search:**
- Type "Python" → Finds all Python-related courses
- Type "程式" → Finds all programming courses
- Type "Java" → Finds Java programming courses
- Type "資料" → Finds data-related courses

**English Search:**
- Type "web" → Finds web development courses
- Type "data" → Finds data science courses
- Type "mobile" → Finds mobile development courses

**Partial Matching:**
- Type "Py" → Finds Python courses
- Type "Java" → Finds Java courses
- Type "React" → Finds React courses

**Level Search:**
- Type "初級" → Finds beginner level courses
- Type "中級" → Finds intermediate level courses
- Type "高級" → Finds advanced level courses

## Search Behavior

### Empty Search
- When search box is empty, shows all courses in current mode
- Works for both "My Favorites" and "All Courses" modes

### Mode Preservation
- Search results persist when switching between modes
- If you search in "My Favorites" mode, results carry over to "All Courses" mode

### Combined with Filters
- Search works with level filter
- Can search and filter at the same time
- Results update dynamically

## Technical Implementation

### Search Function Logic

```javascript
// Search supports multiple matching strategies:
1. Title Match - Matches anywhere in course title
2. Level Match - Matches course difficulty level
3. Description Match - Matches course description (if available)
4. Prefix Match - Matches first few characters of title
```

### Search Filtering

The search function:
1. Extracts the search query
2. Converts to lowercase for comparison
3. Checks title, level, and description fields
4. Uses `includes()` for substring matching
5. Uses `startsWith()` for prefix matching
6. Returns filtered results instantly

### Performance

- **Real-time**: Results update as you type
- **No server requests**: All filtering done client-side
- **Efficient**: Uses native JavaScript array methods
- **Smooth**: No noticeable lag even with 20 courses

## User Interface

### Search Box
- Located at the top of the favorites page
- Placeholder text: "搜尋收藏的課程..."
- Search icon on the left
- Supports keyboard navigation (Enter key)

### Search Results
- Updates instantly as you type
- Shows matching courses in grid layout
- Empty state shown if no results
- Clear visual feedback

## Integration with Other Features

### Works with View Modes
- Search in "My Favorites" mode
- Search in "All Courses" mode
- Results adapt to current mode

### Works with Filters
- Combine search with level filter
- Apply both simultaneously
- Results update based on both criteria

### Works with Quick Add
- Search courses before adding to favorites
- Switch to "All Courses" to search full catalog
- Add found courses directly to favorites

## Examples of Search Queries

### Chinese Queries
```
"Python" → Python 相關課程
"程式" → 程式設計課程
"資料" → 資料相關課程
"網頁" → 網頁開發課程
"機器" → 機器學習課程
```

### English Queries
```
"web" → Web development courses
"data" → Data science courses
"mobile" → Mobile development courses
"react" → React courses
"java" → Java courses
```

### Level Queries
```
"初級" → Beginner courses
"中級" → Intermediate courses
"高級" → Advanced courses
```

## Troubleshooting

### No Results Found
- Check spelling
- Try a different keyword
- Make sure you're in the right mode
- Clear the search box to see all courses

### Search Not Working
- Make sure JavaScript is enabled
- Try refreshing the page
- Check browser console for errors

### Results Not Updating
- Make sure you're typing in the search box
- Try clearing and re-entering the search
- Check if filter is set incorrectly

## Future Enhancements

Potential improvements:
1. Search history
2. Recent searches
3. Search suggestions/autocomplete
4. Advanced search with multiple keywords
5. Search by tags
6. Fuzzy matching for typos
7. Search statistics

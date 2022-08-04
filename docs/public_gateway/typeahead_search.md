# typeahead_search

This search type carries out a fast search designed for typeahead queries using only the search_text parameter to retrieve results. It is run over the **typeahead_search_view** which amalgamates search adn location data into a single view.

## parameters

### search_text

Default: ''
Type: A string > 3 characters long

The search text to be used for the search

### limit

Default: 30
Type: Integer

A limit which applies PER CATEGORY for the search results. ie the maximum number of results per individual category to be returned.


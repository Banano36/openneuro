import React from 'react'
import searchQuery from './search-query'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

/**
 * This component is responsible for obtaining results from Elastic based
 * on the URL string and forwarding the data to the dashboard component
 */
const SearchResults = () => {
  const location = useLocation()
  const searchQueryString = ''
  /*
  useQuery(searchQuery, {
    variables: {
      q: searchQueryString,
    },
  })*/
  return <div>{location.pathname}</div>
}

export default SearchResults
export const OrderImage = (props) => {
  const url = `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?q=${props.keyword}`
  
  const fetchImg = async () => {
   const response = await fetch(url, {
     headers: {
      "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
      "x-rapidapi-key": "332460c4bemshaecfad1c5517c05p15ace2jsn3648918c1a66"
     }
   });
   const json = await response.json();
   
  }

  render() {

  }
}
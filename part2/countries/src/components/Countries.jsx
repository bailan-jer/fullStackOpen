import ACountry from "./aCountry"

const Countries = ( {searchCountry, handleChange, allNames} ) => {

    if (searchCountry.length == 0){
        return (
            <div>
            <form>
                Find countries <input value = {searchCountry} onChange = {handleChange} />
            </form>
        </div>
        )
    }
    const countriesToShow = allNames.filter(name => name.toLowerCase().includes(searchCountry.toLowerCase()))
    const length = countriesToShow.length
    return (
        <div>
            <form>
                Find countries <input value = {searchCountry} onChange = {handleChange} />
            </form>
            {length == 1 ? <ACountry name = {countriesToShow[0]} /> :
                length > 10 ? <p>Too many matches, specify another filter</p> : countriesToShow.map(country => <li key = {country}>{country}</li>)
            }
        </div>
    )
}

export default Countries

const MoreCountries = ({countriesToShow, setSearchCountry}) => {
    return (
        <ul>
            {countriesToShow.map(
                name => <li key = {name}>{name} <button onClick = {(event) => setSearchCountry(name)}>Show</button></li>
            )}
        </ul>
    )
}

export default MoreCountries

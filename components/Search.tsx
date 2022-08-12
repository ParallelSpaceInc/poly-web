function SearchBar() {
  return (
    <div className="block mt-6 relative">
      <input
        className="p-2 pl-4 w-full ring-2 ring-gray-300 focus:ring-indigo-500 text-xl rounded-md outline-none"
        placeholder="Find model"
      ></input>
    </div>
  );
}

export default SearchBar;

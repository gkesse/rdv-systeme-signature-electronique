const SelectLanguage = (props) => {
    const languages = [
        { value: "en", text: "English" },
        { value: "fr", text: "Français" }
    ];

    return (
        <div
            className={`${
                !props.isProfile && " mt-[9px] pb-2 md:pb-0 "
            } flex justify-center items-center `}
        >
            <select
                className={`${
                    !props.isProfile ? " md:w-[15%] w-[50%]" : "w-[180px]"
                } rdv-select rdv-select-bordered  bg-white rdv-select-sm `}
                defaultValue={"DEFAULT"}
            >
                <option value="DEFAULT" disabled>
                    Select a language
                </option>
                {languages.map((item) => {
                    return (
                        <option key={item.value} value={item.value}>
                            {item.text}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default SelectLanguage;

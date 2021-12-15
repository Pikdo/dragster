const getEmoji = () => {
    const emojis = [
        "😏",
        "😎",
        "😍",
        "🤖",
        "😺",
        "🤠",
        "🤑",
        "😁",
        "😊",
        "👽",
        "😬",
        "🤩",
        "🤗",
        "😛",
        "😃",
        "🤓",
        "🙄",
        "😴",
    ];
    let numero = Math.round(Math.random() * (emojis.length - 1));
    return emojis[numero];
};

export default getEmoji;

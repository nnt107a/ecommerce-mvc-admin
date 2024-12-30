function hashId(Id) {
    let hash = 0;
    for (let i = 0; i < Id.length; i++) {
        const char = Id.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 100000);
}

module.exports = { hashId };
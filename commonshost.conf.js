module.exports = () => ({
    hosts: [
        {
            domain: 'dandy-fat-wombat.commons.host',
            directories: {
                trailingSlash: 'never'
            },
            fallback: {
                404: '404.html'
            },
            manifest: 'serverpush.json'
        }
    ]
})

function test123()
{
    console.log("Player File loaded")
    console.log(extractUrlVariable(window.location.href))
}

function extractUrlVariable(urlString)
{
    return urlString.split("#")[1]
}
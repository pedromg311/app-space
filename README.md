# MARVEL Finder

## Available Scripts

### `npm star`

Starts the application in development mode.
[WARNING] - The API being used has a request limit of 3000 calls per month

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm build`

Builds the application for production

## Description :

I used the Marvel API to make a simple App that access the "All characters" list and presents it nicely on the screen. This list can be sorted by name and modified date either in ascendent or descendent order. Since no more sorting options are available on the API i only used these 2. Since combining other sorting options with my own BE would've been out of scope of the project.

The app also provides filters that can be combined with each other to fetch specific characters. Unfortunately, again, apart from the name, the other fields use an id. An id that is impossible to know unless the user has access to the API. On a real application these ids are used to fetch the correspondent information about that specific resource, and a user would be able to filter by comic name for example (instead of comic id). But since the API has 3000 limit per month, i decided against it.

If an item on the list is clicked the user is taken to that character's details. There he can find a picture, a description, if available, and various lists representing different media with names of episodes/magazines/arcs in which that particular character participated.

## Decisions :

1. I used the Context API for sharing data since the state is really easy to maintain in such small app. Stuff like sorting can technically be high frequency changes that should require something a big more robust like my own store with custom hooks or redux. But for the propose i think it is enough

2. Decided against SCSS (or other post css frameworks) since i didn't really need most of its features for something this simple. also CSS is getting there in terms of features. Only missed the nesting

3. This apps favours network over memory BUT in some cases i used the other way around like not refetching the list page when the user navigates back or refetching the character details when the user navigates into one.

## SEMI-TODO :

- A button just for the purpose of resetting the list might've been more UX friendly
- useMemo in some of the components might have been a nice addition but i still don't know enough to correctly measure the benefits. But for such small components with "easy on the CPU" logic, i think leaving it out is ok
- Component testing, and e2e could have been added but i don't think these add a lot of value for apps that won't change for a long time (probably ever). But i could've added more unit tests, but since i like working in semi-TDD mode, adding more in the end of development just for the sake of it seems unnecessary.
- -Accessibility is always of focus of everything i build but trying to juggle time constraints mixed with a new framework was way to hard. So i added the basics. The filter can mostly likely be improved.
- -The API key could probably have been hidden, but since it's a public key that is restricted by domain on my marvel account i left there, to avoid the need for a BE

## Application:

The application is currently hosted on firebase, and can be accessed with the following link: http://localhost:3000/characters#main [WARNING] - The API being used has a request limit of 3000 calls per month

### Final notes:

Since this was my "first real React App" there was a lot of refactoring and learning involved. There's probably a lot of things that i would have done better and will do better in the future when i have more experience with the framework. But with that said the jump from Vue to React wasn't as difficult as i expected, and i was able to "port" a lot of rules and standards from one framework to the other.

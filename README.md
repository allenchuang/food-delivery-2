# CloudKitchen Challenge Demo 2019

This project is handmade by Allen Chuang, using Node.JS, Express, Socket.io, React, Redux, Redux-Saga, Material-UI, MapBox API, React Map GL. Using Enzyme and Jest for testing.

🍔🌮🍣🥟🥡🍱🍛

## Instructions

To quickly get the project up and spinning simply run:

### `npm i`

then

### `npm run dev`

This starts both the server [http://localhost:4001](http://localhost:4001) and client [http://localhost:3000](http://localhost:3000)

#### Communicating with server-side socket

To initiate the socket connection, please click on the "Play" button on the upper-right of the app.

To stop the connection, you can click on the "Stop" button.

To reset the Redux store, you can click on the "Trash" icon.

#### Dashboard Views

There are a total of three views for this app.

- The main dashboard view consists of the Active Orders table along with a map on its side.

- The tab beneath it will take you to the Order History view, along with a line chart showing the number of total orders at a given second.

- The third tab is a full screen map view to see the orders take place in live action.

### Analysis of the problem

I had a lot of fun tackling this challenge as it requires thinking about the infrastructure and how the data should flow. Let's dive in on my thought process:

### Server-side 📺

Starting with the server-side logic, I decided to go with using Socket.IO as it is relatively light-weight and can get up and running quickly without too much overhead and configurations.

Because we are serving the data sourced from a local .json file for which the data isn't sorted, I used a setInterval timer on server start to start counting the seconds and emitting the data matching `sent_at_second` property. Due to the live nature of this challenge, for data that are submitted at the same time, I used a for loop to simulate triggering multiple emits. Also, the server would need to be responsible for incoming updates from the client. To achieve this, I have the socket listen for a `updateOrder` event, and for the sake of simplicity, I simply have it append the updated order to the end of the JSON array. (Ideally, this would link to a database for storage, perhaps NoSQL).

(In a real world application, the server-side will have to be built to scale, so ideally we would use clusters to utilize multiple threads and use sticky-sessions to preserve client connection with the same host node. On top of that, we will need Redis to ensure that all the nodes will share memory for data consistency. I have a work in progress version available on GitHub and will continue to work on it given more time...)

### Client-Side 💻

On the client side, I decided to leverage React with Redux so that we have a centralized store where data can reside. The idea is to have Redux do all the heavy-lifting for incoming data and for React just to consume the data and render. After spending sometime thinking about the implementation, I decided to go with Redux-Saga as the middleware as it allows easy handling of asynchronous side-effects. It acts as a seperate thread in the application solely responsible for side-effects, which means we can dispatch actions to command its behaviors. (I am also familiar with Redux-Thunk, ... actually more familiar with Redux-Thunk, but decided to go with Saga for the challenge and to have a more firm grasp on Saga and generator functions in general 😉).

The great thing about Saga is it comes equipped to handle channels such as Socket.io. I used the `eventChannel` factory function to connect with our incoming socket emits and provide concurrency . I have a main Saga which listens to start and stop action dispatched from the client to keep things running smoothly. Within the Saga generator I use `yield fork` to fork out multiple processes to "watch" for incoming socket data as well as events such as `disconnect`, `reconnect`. I also wrote a loop to fork out multiple listeners for incoming socket data, with the number of listeners configurable in a config variable. This allows us to have multiple listeners to take incoming data, and events will be taken by whichever listener is available.

### Getting Geo / Map data 🌍

I also decided to take on the Bonus Challenge of implementing a map using MapBox API. This adds complexity to our application as we would be required to make API calls to get the geocode coordinates based on the address as well as the route from the kitchen. The two calls need to be chained because we need the geocode first before we can query for the route directions. To do this I created a `fetchGeoData` async function to make the two chained requests the first time a new order is received. To simplify things, I check if the order.event_name is CREATED to decide whether to make the fetch calls, as it would save us calls because we won't need to make trips for all the events. The decision is to make the call the very beginning once we received the data back from the `eventChannel` `emitter` and right before it reaches our Redux store to enforce the live nature of the app. There could be ways to buffer / queue the necessary calls in the background to help with data latency should there be some leeway on the "live" requirements.

The data received is then appended to the `order` object as `longitude`, `latitude`, and `directions` properties before dispatching the data to Redux reducer. ( I also note down that this has to be addressed in the case of address updates. I would probably have a function comparing it with the current object to see whether the address has changed to determine if we should fetch again...However, for the purpose of this demo that part is omitted. )

### Reducer ✅

Once the data reaches the reducer, I kept the original data stream in a `data` object in store for the order history and used the data to construct a `orderMap` object map of the orders based on their `order.id` because this will allow us to do quick look up of the data and help with displaying active orders later on. It is generally a good practice to normalize the data in Redux so that they could be quickly accessed and avoid deep nesting lookups of values. I also keep a record of the `sec` elapsed as we will need it to check for COOKED orders within the time range. The idea here is to keep the `data` and `orderMap` as our source of truth and use reselectors later on to filter for the dataset we need for rendering.

The way I structured the Redux store, I kept the most relevant data on the top level of our reducer where it is needed throughout the app, and UI element specific information such as filters in their own respective object. I then combine them using combineReducers.

### Code Refactoring ✅

On top of the requirements to create "Order History" and "Active Orders" views, I also taken up the challenge of creating an "Inactive Orders" view. Given that we have everything we need in Redux as the source of truth it would be easy to do so. The way I envisioned it, it should be easy to specify a "type" of orders we want and have everything work together based on similiar and careful naming conventions. I can easily write Higher Order functions that take in a specific type and reuse logic to get the type of data I need. With this in mind, I constructed CONSTANTS and ACTIONS constants in the same pattern for ALL_ORDERS, ACTIVE_ORDERS, and INACTIVE_ORDERS to allow for code refactoring and keeping the codebase D.R.Y.

This allows us to write less code and to reuse components such as OrderTable, action creators, and reducers to do similar things. It also allows us to create filters for all three datasets and have their filter event_type display correspondingly.

### Re-ReSelectors ✅

With Redux storing all the data we need, I went on with creating selectors to filter the respective data. I used `re-reselect` library as it offers caching capabilities given the same input to prevent re-rendering on prop change. (In hindsight, given that we need the "live" seconds to do the filter for the COOKED seconds and the fact that data is streaming in constantly, it does not live up to its full potential. It could be better utilized in places where data is more constant and updated less frequently such as a monthly overview of orders as a future feature) I wrote snippets of various selectors and use them to build the necessary Higher Order selector functions we need to reconstruct our data using our clever naming conventions. I also created a look-up map where we can map the order type (ACTIVE_ORDERS, ALL_ORDERS...) to the name of the matching filters in our store.

### Tables 📝

Once all the data logic is in place its time to pass in the data for our table views! Finally, all the hardwork and meticulous thinking pays off as we can now reuse the OrderTable component to render the three types of order we planned. We simply pass in a prop called `orderType` with the OrderTable component and voila- we have three types of tables, along with their corresponding filters. All of them stored in Redux and ready at our service.

There's also the requirement to be able to update the event type of an order. I decided to go with an edit button on the table which renders a popup that allows us the select the dropdown and select the new status. The submitted order is then dispatched as an action and emitted to the socket in our write saga.

### UI Styling 🖍

I then took some time to play around with the styling and layout of the UI, adding colors to the event type to distinguish them apart and using media queries to specify how much space they should take up. With the end users in mind, I pictured that the app would most likely be used in a Tablet setting in the kitchen so I optimized for that, making sure everything displays nicely and ease of use for the screen size. This includes hiding non-essential data such as geocordinates and the inactive table so that users can focus on what's most essential for the screen real estate. With more time I would probably have gone for a card layout approach for the Active Orders table as it eliminates the need for horizontal scrolling, but for the sake of this demo I think this gets the job done.

### MapBox API and React Map GL 🗾

With the table done, I spend some time digging through the documentations on MapBox and React Map GL to render the Markers and Routes. I decide to have the markers the same color as the event type so that they match each other on the Main Dashboard view. The geocode and directions information are all available to us so we can simply use those data to render the elements we need on the map. The first thing I note is that there are several overlapping addresses and seems to be overlaying ontop of each other. Given more time, this could be resolved by using clustered markers on the map so that they show less detail when you zoom out of the map and show up when you zoom in.

(NOTE: I keep getting an warning message: `Warning: Cannot update during an existing state transition (such as within`render`). Render methods should be a pure function of props and state.` using React Map GL, seems like this has to do with the function `_updateViewport`. It seems like this is a known issue, with others facing the same message and has since been reported as a bug on GitHub Repo)

### Testing 🔧

For testing the application. I test mainly through separations of concerns with a Behaviour driven approach, which means testing our Actions, Reducers, Selectors, Sagas, and Components separately. This ensures that all the functionalities are covered. For example, for components, I would test that on click of an event, the store will receive the correct dispatched actions. For actions, it means that the action creators should dispatch the right action type and payload. Selectors, so that the higher order selectors work and filter out data correctly. For Sagas, I utilized a library called redux-saga-test-plan where it allows us to assert and mock Saga effects such as `call` and `take` effects, and instead of testing each step of the Saga one by one it allows us to test more specifically the side-effects and the outcome of the ran Saga.

### Summary ✌🏼

All in all it was a great experience in tackling this challenge. I had a lot of fun building the app and each day I keep thinking of ways to improve it even more. Some of the features I'd like to add if given more time:

- Better server infrastrucutre - Clusters + Sticky Sessions + Redis for scalability
- Beef up client side and server architecture to handle heavy load and stress test
- Docker + Orchestration with Kubernetes / AWS / GCP
- Setup backend database for data store
- An individual order view page for just 1 order to be able to track the status and view more details on it
- More charts varieties, i.e. bar chart to show categories of food ( American, Japanese, Italian...)
- Better organization of dashboard optimized for kitchen setting
- More code refactoring and clean up
- Minimize Material-UI bundle
- More testing coverage to ensure continuous development and ease of collaboration
- More dynamic mapping - routes with ETA, animations showing the driver position
- Support images for orders
- Accessibility

## Other Commands:

Run just client:

### `npm start`

Run just server:

### `npm run server`

Run tests:

### `npm test`

Run build:

### `npm run build`

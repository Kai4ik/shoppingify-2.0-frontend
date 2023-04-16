# Shoppingify

**What is Shoppingify and why?**

---

In the last year, there were a lot of conversations about inflation.
For instance, prices for food increased by **8.9%.**
<https://www150.statcan.gc.ca/n1/daily-quotidien/230117/dq230117b-eng.htm>

> That's why Shoppingify was built which simply allows me to know how the price fluctuates for different products I buy, how often I buy a certain product, how much I spend each month, etc.

**How it works?**

 ---

The main idea of the Shoppingify app is to allow users quickly upload the receipt image and after it will be scanned, save it and have access to statistics & interesting insights.

More details on how it works can be viewed [here](https://github.com/Kai4ik/shoppingify-2.0-frontend/wiki)

## **Tech stack**

The app consists of 3 main parts:

- **Frontend**
  - Next.js 13 (app directory feature)
  - Chakra UI
  - TypeScript
  - GraphQL.

- **Backend**
  - Python (Fast API)
  - veryfi
  - boto (AWS SDK)

- **PostGraphile**
  - PostGraphile (formerly PostGraphQL) builds a powerful, extensible and performant GraphQL API from a PostgreSQL   schema in seconds; saving you weeks if not months of development time. <br/>More on that [here](https://github.com/Kai4ik/shoppingify-2.0-pgql)

## **More on frontend**

Everything was built around the **[Next.js 13](https://nextjs.org/blog/next-13#server-components)** framework with its app experimental directory, server components as a default type and other great features (layouts,  improved links, etc.)

- Server components were used for some pages to fetch data from the database and reduce the amount of JavaScript sent to the client.
- Layout feature was used to share UI between pages and avoid expensive re-renders
- Next.js middleware was used to check whether a user is logged in or not

 ---
 **[Chakra UI](https://chakra-ui.com/)** was used as a main CSS library that has many prebuild components (Flex, Stack, Input, Button, Accordion, Alert, etc.) and easy-to-use styled system.

---
For authorization & authentication purposes, **[AWS Cognito](https://aws.amazon.com/cognito/)** was used - specifically [amazon-cognito-identity-js library](https://www.npmjs.com/package/amazon-cognito-identity-js).
Currently, it allows users to register an account with email, confirm it, log in, reset the password & log out.
In the future, email modification & other attributes modification will be implemented.

 ---
There are a lot of forms on the app and to handle them, 2 libraries came in handy - **[Formik](https://formik.org/docs/overview)** and **[react-hook-form](https://www.npmjs.com/package/react-hook-form)**

Formik was used for all authentication & authorization-related forms that are pretty simple and consist of 2-6 input fields.

To handle more complex forms that consist of 20+ fields react-hook-form was used instead as Formik was working much slower when handling so many fields.

Schema validation was implemented using **[Yup](https://www.npmjs.com/package/yup)** library

---
**[Chart.js](https://www.chartjs.org/docs/latest/)** helped to build simple and the same time highly customizable charts (currently only bar & pie charts are used).
As super complex charts were not required for this app, Chart.js was chosen over D3

---
To retrieve the data from the database, an extended **[fetch](https://beta.nextjs.org/docs/data-fetching/fetching)** feature was used (that is built on top of React's extended version of it) & GraphQL queries as I used PostGraphile which generated GraphQL API from a Postgres database.

---
 For storing receipt images & all the receipts & product information, **[AWS S3](https://aws.amazon.com/s3/)** and **[AWS RDS](https://aws.amazon.com/rds/)** were used accordingly.
 To interact with S3 Client, this library was used - <https://www.npmjs.com/package/@aws-sdk/client-s3>

## **Deployment**

 1. Next.js app was deployed on **[Vercel](https://vercel.com/docs)**
 2. Heroku is used to run the Fast API server
 3. The PostGraphile image is stored on Docker hub (<https://hub.docker.com/>)
 4. The Google Cloud Run is used to run the container that start PostGraphile (<https://cloud.google.com/run>)

**The following credentials can be used to test the app** \
Username: test_user@gmail.com \
Password: testPassword66==

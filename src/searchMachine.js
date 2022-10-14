import axios from "axios";
import { assign, Machine } from "xstate";

//------------------------------------------
const fetcher = async (url) => {
  try {
    const response = await axios(url, {
      method: "GET"
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
//------------------------------------------
export const searchMachine = Machine({
  id: "search",
  initial: "idle",
  context: {
    renders: 0,
    query: "",
    data: null
  },
  states: {
    idle: {
      on: {
        TYPING_START: "typing"
      }
    },
    typing: {
      on: {
        INPUT: { actions: assign({ query: (c, e) => e.value }) },
        SUBMIT: {
          target: "loading",
          cond: (c, e) => c.query.length > 0
        }
      }
    },
    loading: {
      invoke: {
        id: "fetcher",
        src: (c, e) =>
          fetcher(
            `https://jsonplaceholder.typicode.com/comments?postId=${c.query}`
          ),
        onDone: {
          target: "resolved",
          actions: assign({
            data: (c, e) => {
              console.log(e);
              return e.data;
            }
          })
        },
        onError: "rejected"
      }
    },
    resolved: {
      on: {
        INPUT: "typing"
      }
    },
    rejected: {
      on: {
        INPUT: "typing"
      }
    }
  }
});

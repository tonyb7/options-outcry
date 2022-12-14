import { useEffect, useState } from "react";

import firebase from "../firebase";

function useFirebaseRef(path: string, once = false) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (path) {
      const ref = firebase.database().ref(path);
      const update = (snapshot: any) => {
        // console.log("useFirebaseRef GOT VALUE");
        if (once) {
          ref.off("value", update);
          // ref.off("child_changed", update);
        }
        setValue(snapshot.val());
        setLoading(false);
      };
      ref.on("value", update);
      // ref.on("child_changed", update);
      // console.log("useFirebaseRef LISTENING FOR VALUE");
      return () => {
        ref.off("value", update);
        // ref.off("child_changed", update);
      };
    }
  }, [path, once]);

  return [value, loading];
}

export default useFirebaseRef;

import React, { useEffect } from "react";

import { showNotification } from "@mantine/notifications";
import { Redirect, useQueryParams } from "raviger";
import { useMutation } from "react-query";
import { Check } from "tabler-icons-react";

import { googleLogin } from "../api/api";

const OauthCallback = () => {
  const { code } = useQueryParams()[0];
  const googleLoginMutation = useMutation(
    async (code) => {
      const response = await googleLogin({ code });
      return response;
    },
    {
      onSuccess: (data) => {
        if (data[0] === 201) {
          showNotification({
            message: "Template created successfully",
            title: "Success",
            color: "green",
            icon: <Check />,
          });
        }
      },
    }
  );
  useEffect(() => {
    console.log({ code });
    googleLoginMutation.mutate(code);
  }, [code, googleLoginMutation]);

  return (
    <div>
      HI
      {googleLoginMutation.isLoading && <div>Loading...</div>}
      {googleLoginMutation.isError && <div>Error</div>}
      {googleLoginMutation.isSuccess && (
        <div>
          Success
          <Redirect to="/" query={false} merge={false} />
        </div>
      )}
    </div>
  );
};

export default OauthCallback;

const uploadFile = async (event, setState, setIsLoading = null, key) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0]

      if (setIsLoading) setIsLoading(true)
      // UPLOAD
      const docUrl = await backendConnector.uploadFile(
        ConnectorUtils.optimizeFormData({ file: img })
      )

      if (docUrl) {
        if (docUrl?.length) {
          setState(docUrl)

          registerFormUpdate({
            ...registerForm,
            [key]: docUrl,
          })
        }
      }
      if (setIsLoading) setIsLoading(false)
    }
  }
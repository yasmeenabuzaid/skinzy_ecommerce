class ConnectorUtils {
    optimizeFormData(obj) {
      var bodyFormData = new FormData()
  
      Object.keys(obj)?.forEach((key) => bodyFormData.append(key, obj[key]))
  
      return bodyFormData
    }
  }
  
export default new ConnectorUtils()
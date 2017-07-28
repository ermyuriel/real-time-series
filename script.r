needs(xts)
needs(forecast)


timestamps<-as.POSIXct(input[[1]][['timestamps']]/1000, origin = '1970-01-01')

values<-as.numeric(input[[1]][['data']])

series<-xts(values, order.by=timestamps)


as.data.frame(series)
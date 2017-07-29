needs(xts)
needs(forecast)


timestamps<-as.POSIXct(input[[1]][['timestamps']]/1000, origin = '1970-01-01')

values<-as.numeric(input[[1]][['data']])

df<-data.frame(timestamps,values)

names(df)<-c("time","values")

x<-xts(df$values,df$time)

x.ts<-as.ts(as.numeric(x))
x.ets <- ets(x.ts)
x.fore <- forecast(x.ets, h=1)

as.data.frame(x.fore)

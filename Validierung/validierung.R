library(RODBC)


#################################################################################
###############################findOutliers FUNCTION#############################
#################################################################################

## identifies and flags outliers in the measurements using running median and
## left-sided window
## INPUTS: table (res), window size (ws)
## OUTPUT: updated table (res)

findOutlier <- function(res, ws){
  
  if (ws < 0) 
    stop("'ws' must be positive")
  
  if (ws%%2 == 0) 
    warning("'ws' must be odd!  Changing 'ws' to ", ws <- as.integer(1 + 2 * (ws%/%2)))
  
  xt <- res[,c("val_msr")]
  xtmed <- runmed(xt,ws)
  i <- length(xt)
  n <- 1
  
  
  while(i>(n+ws-1)){
    ## validation of all but the first k=ws measurments
    ## finding outliers using left sided window
      window = xt[(i-ws):(i)] 
      ir = abs(quantile(window, 0.75)-quantile(window, 0.25)) 
      med = xtmed[i]
      res[,c("id_qi_fk")][[i]] <- if (xt[i]<(med-1.5*ir) || xt[i]>(med+1.5*ir)) "101" else "102"    
      i=i-1
    
  }
  return(res)
  
}





#################################################################################
########################Database access and validation###########################
#################################################################################



## Connect to database
ch<-odbcConnect("PostgreSQL35W")

## Set schema
odbcQuery(ch,"SET search_path =demo, pg_catalog;")





## fois: ids of all features of interest
fois <- sqlQuery(ch, paste("SELECT id_foi FROM foi"))

## observed properties
obspr <- sqlQuery(ch, paste("SELECT id_opr FROM observed_properties"))


i <-1 
ws <- 7


## Get non-validated measurements plus related foi's of each foi by joining following tables:
## procedures, event_time, measures
for(i in 1:length(fois[[1]])){
  ## Get the non-validated data
  rawData <- sqlQuery(ch, paste("SELECT 
                               id_prc, id_foi_fk, id_msr, id_eti_fk, id_qi_fk, id_opr_fk, val_msr 
                               FROM 
                               procedures INNER JOIN event_time ON procedures.id_prc=event_time.id_prc_fk
                               INNER JOIN 
                               measures ON measures.id_eti_fk=event_time.id_eti",
                               "WHERE 
                               measures.id_qi_fk = 100 
                               AND 
                               procedures.id_foi_fk= (",fois[i,1],")
                               ORDER BY 
                               measures.id_msr")) 
  ## If it's not the very first dataset, we need some already validated data to validate the first
  ## k=ws measurments of rawData
  if(min(rawData[,c("id_msr")]) >ws){
  helperData <- sqlQuery(ch, paste("SELECT
                               id_prc, id_foi_fk, id_msr, id_eti_fk, id_qi_fk, id_opr_fk, val_msr
                               FROM 
                               (SELECT * FROM (procedures INNER JOIN event_time ON procedures.id_prc=event_time.id_prc_fk
                               INNER JOIN measures ON measures.id_eti_fk=event_time.id_eti)"
                               ,"WHERE 
                               procedures.id_foi_fk= (",fois[i,1],")
                               AND 
                               measures.id_msr < (",min(rawData[,c("id_msr")]),")
                               ORDER BY 
                               measures.id_msr DESC LIMIT (",length(obspr[[1]])*ws,")) as T 
                               ORDER BY
                               T.id_msr ASC"))
  
  
  ## prepared data
  editData <- rbind(helperData, rawData)} else {editData <- rawData}
  
  
  
  ## gets the measured values for each observed propertie and validates them
  ## if the table is not empty
  for(j in 1:length(obspr[[1]])){
    res<-editData[editData$id_opr_fk==obspr[j,1],]
    
    if (nrow(res)==0) j=j+1 else res <-findOutlier(res,ws)
    
    ## Update table
    sqlUpdate(ch,res,"measures")
  }

}

  

## close conection
close(ch)



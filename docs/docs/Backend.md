## Backend

In this section all the REST PHP files will be explained. We assume prior knowledge of PHP here on. 


#### allSocialNetwork.php
This API helps in getting the Transactional Network for all the paintings.

**Requires** 

[commons.php](#commonsphp)

** Params: Get **

* start: year from which the network should be created
* end: year till which the network should be created


** Algorithm: **

This file starts with looping over every painting name in `<code>/public/data` and reading the data.csv file which currently acts like a database for the painting. This file contains information of Replica being transferred to many different owners. First a variable `$dataCreation` is intitilized which has a key `element`. The purpose of this is to store the previous elements which have been read. This helps in tracking the parent node from whom the painting was transfered. 

The algorithm for every row works in this fashion:-

* If the node has a parent node create a transactions information with source and target and if not then do nothing.
* Updates the In-Nodes(Buying Paintings) and Out-Nodes(Selling Paintings). In-Nodes for the person who is taking the painting and out-node for person who is giving the painting.
* Insert the element in `$dataCreation`

The whole algorithm depends of HashMap and names being unique. If the names are not unique then alterations to algorithms would be required.


#### commons.php

This Library is used by all REST scripts. Basically this provides function to output data in json format.


#### getComparisonNetwork.php

** Requires **

[commons.php](#commonsphp)

**Params: Get**

* name: Name of the Painting

** Algorithm: ** 

This REST script is very easy to understand. It takes the the name of the painting and reads the data.csv of that painting. For every row it inserts a record in the output array which has `[Replica ID, [Array of information required]]`. If you would have to change anything it will probably in `[Array of information Required]`. Please don't change the order, if you want to add more content just append to that array.

#### getPaintingImages.php

** Requires **

[commons.php](#commonsphp)

**Params: Get**

* name: Name of the Painting

** Algorithm: ** 

The algorithms is very similar to [getComparisonNetwork.php](#### getComparisonNetwork.php). The difference lies in that it pushes the image link to be used in `img` tag. If you plan to upgrade the website we would recommend merging the two scripts.

#### getPaintings.php

** Requires **

[commons.php](#commonsphp)

**Params: Get**

* name: Name of the Painting

** Algorithm: ** 

This just returns the `scandir` result of `<code>/public/data` directory.

#### getRawData.php

** Requires **

[commons.php](#commonsphp)

**Params: Get**

* name: Name of the Painting

** Algorithm: ** 

This just reads every data.csv file and creates a entry for all the rows. You can maninpulate the data you would like to show in raw data visualisation. It will also add image information to the row which is nothing but just adding a link. 

#### getReplicaInfo.php

** Requires **

[commons.php](#commonsphp)

**Params: Get**

* paintingName: Name of the painting for which you want the data.
* paintingReplica: Replica for which you want the information.

** Algorithm: **

The purpose of this file is to provide the data for narrative visualisation.

* First this API will look into the `paintingName` directory, find the `data.csv` file and collect all the information about the `paintingReplica`. PS all this information about `paintingReplica` and `paintingName` can be taken from [getReplicaName.php](#getreplicanamesphp) and [getPaintings.php](#getpaintingsphp)
* Once that is done the code tries to optimally store the content for frontend.
* Next thing is collection of owner information which includes about the owner narrative and image of the owner. This information is kept with every replica in data directory.
* Finally all data is passed to the api requester.

#### getReplicaNames.php

** Requires **

[commons.php](#commonsphp)

**Params: Get**

* name: Name of the painting for which you want the data.

** Algorithm: **

This API provides all the names of Replica for a painting that it takes as a paramter. The results are from `scandir` function.

#### getSocialNetworkData.php

** Requires **

[commons.php](#commonsphp)

**Params: Get**

* name: Name of the painting for which you want the data.

** Algorithm: **

This is same as [allSocialNetwork.php](#allsocialnetworkphp). The only difference lies is in that it provides social network for a specific painting that it takes as a paramters.


#### chord_diagram.php

** Requires **

[commons.php](#commonsphp)


** Algorithm: **

This file is used to collect information on chord flow. How this works is it scans all the excel CSVs in the data folder capture the replica flow and based on the year in which the transaction happened calculates the range of the year. Once the year range is defined the transaction is inserted in that range. In this key 1860 would represent that the transaction happened in between 1860-1885. 


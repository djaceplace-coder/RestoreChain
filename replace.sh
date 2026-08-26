#!/bin/bash
find src public index.html -type f -exec sed -i 's/RestoreChain/Tracefield/g' {} +
find src public index.html -type f -exec sed -i 's/restorechain/tracefield/g' {} +
find src public index.html -type f -exec sed -i 's/Restorechain/Tracefield/g' {} +
find src public index.html -type f -exec sed -i 's/hello@tracefield.co.uk/info@tracefield.co.uk/g' {} +
find src public index.html -type f -exec sed -i 's/sos@tracefield.co.uk/info@tracefield.co.uk/g' {} +
find src public index.html -type f -exec sed -i 's/support@tracefield.com/info@tracefield.co.uk/g' {} +
find src public index.html -type f -exec sed -i 's/hello@restorechain.co.uk/info@tracefield.co.uk/g' {} +
find src public index.html -type f -exec sed -i 's/sos@restorechain.co.uk/info@tracefield.co.uk/g' {} +
find src public index.html -type f -exec sed -i 's/support@restorechain.com/info@tracefield.co.uk/g' {} +

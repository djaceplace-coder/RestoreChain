const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

// The problematic syntax:
// </div>
//             </div>
//                         </div>
//             </div>
//
//             {/* Recent Transactions */}
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-8">

const badSyntaxRegex = /<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Recent Transactions \*\/\}/;

const goodSyntax = `            </div>

            {/* Recent Transactions */}`;
            
if (badSyntaxRegex.test(content)) {
    content = content.replace(badSyntaxRegex, goodSyntax);
    
    // Now we need to append those two closing divs AFTER the Recent Transactions div.
    // The Recent Transactions div ends at:
    //                   </table>
    //                 )}
    //               </div>
    //             </div>
    // 
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   );
    // }

    // It looks like I already had 
    //           </div>
    //         </div>
    //       )}
    // after it. Wait, let's look at the end of the file.
    fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', content);
    console.log("Replaced bad syntax");
} else {
    console.log("Could not find bad syntax pattern.");
}

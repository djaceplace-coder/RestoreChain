const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

const search = `                      />
                    </div>
                  </div>
                )}
                  </div>
                </>
              )}`;

const replace = `                      />
                    </div>
                  </div>
                  </div>
                )}
                </>
              )}`;

content = content.replace(search, replace);

// Let's also fix the fiat provision mode to hide inputs if action is clear
const searchFiat = `{provisionMode === 'fiat' && (
                <div className={\`p-5 rounded-2xl border \${txAction === 'credit' ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}\`}>`;

const replaceFiat = `{provisionMode === 'fiat' && txAction !== 'clear' && (
                <div className={\`p-5 rounded-2xl border \${txAction === 'credit' ? 'bg-green-50/50 border-green-100' : txAction === 'set' ? 'bg-blue-50/50 border-blue-100' : 'bg-red-50/50 border-red-100'}\`}>`;

content = content.replace(searchFiat, replaceFiat);

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);

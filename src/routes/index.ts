import express from 'express';
import userProfileRoutes from '../routes/user-profiles.routes';
import roleUserRoutes from '../routes/role-user.routes';
import BusinessInfoRoutes from '../routes/business-info.routes';
import AuditRoutes from '../routes/audit-reports.routes';

const app = express();
app.use('/userProfiles', userProfileRoutes);
app.use('/roleUsers', roleUserRoutes);
app.use('/businessInfo', BusinessInfoRoutes);
app.use('/audits', AuditRoutes);

export default app;
import { Grid, Paper, Button, List, ListItem, Link } from "@mui/material";
import { blue, grey } from "@mui/material/colors";

export default function Home() {
  return (
    <div className="p-5 flex gap-5 p-bg-gray-100">
      <Grid id="sidebar" item xs={4}>
        <Paper
          sx={{
            height: 1000,
            width: 250,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TaskBar />
        </Paper>
      </Grid>
      <Grid container spacing={2}>
        {/* First row: 3 equal columns */}
        <Grid item xs={4}>
          <Paper
            sx={{
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Box 1
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            sx={{
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Box 2
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            sx={{
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Box 3
          </Paper>
        </Grid>

        {/* Second row: 2 equal large columns */}
        <Grid item xs={6}>
          <Paper
            sx={{
              height: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Big Box 1
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            sx={{
              height: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Big Box 2
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

function TaskBar() {
  const items1 = [
    { name: "Default", href: "/dashboard-statistics" },
    { name: "Analytics", href: "/dashboard-analytics" },
  ];
  const items2 = [
    { name: "Statistics", href: "/dashboard-statistics" },
    { name: "Data", href: "/dashboard-data" },
    { name: "Chart", href: "/dashboard-chart" },
  ];
  const items3 = [
    { name: "Users", href: "/dashboard-users" },
    { name: "Customers", href: "/dashboard-customers" },
    { name: "Employees", href: "/dashboard-employees" },
    { name: "Products", href: "/dashboard-products" },
    { name: "Orders", href: "/dashboard-orders" },
    { name: "Mail", href: "/dashboard-mail" },
    { name: "Messages", href: "/dashboard-messages" },
    { name: "Logs", href: "/dashboard-logs" },
  ];
  return (
    <div>
      <List>
        {items1.map((item) => (
          <Link href={item.href}>
            <ListItem>{item.name}</ListItem>
          </Link>
        ))}
      </List>
      <h2>Widget</h2>
      <List>
        {items2.map((item) => (
          <Link href={item.href}>
            <ListItem>{item.name}</ListItem>
          </Link>
        ))}
      </List>
      <h2>Application</h2>
      <List>
        {items3.map((item) => (
          <Link href={item.href}>
            <ListItem>{item.name}</ListItem>
          </Link>
        ))}
      </List>
    </div>
  );
}

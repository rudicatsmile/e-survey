import 'package:go_router/go_router.dart';
import '../../features/respondent/splash_screen.dart';
import '../../features/respondent/onboarding_screen.dart';
import '../../features/respondent/home_screen.dart';
import '../../features/respondent/qr_scanner_screen.dart';
import '../../features/respondent/hospital_detail_screen.dart';
import '../../features/respondent/survey_flow_screen.dart';
import '../../features/respondent/survey_success_screen.dart';
import '../../features/respondent/local_history_screen.dart';
import '../../features/officer/officer_login_screen.dart';
import '../../features/officer/officer_dashboard_screen.dart';
import '../../features/officer/officer_qr_screen.dart';
import '../../features/officer/officer_live_feed_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/onboarding',
      builder: (context, state) => const OnboardingScreen(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/qr-scanner',
      builder: (context, state) => const QrScannerScreen(),
    ),
    GoRoute(
      path: '/hospital-detail',
      builder: (context, state) => const HospitalDetailScreen(),
    ),
    GoRoute(
      path: '/survey-flow',
      builder: (context, state) => const SurveyFlowScreen(),
    ),
    GoRoute(
      path: '/survey-success',
      builder: (context, state) {
        final code = state.uri.queryParameters['code'] ?? 'RES-2025-001430';
        return SurveySuccessScreen(code: code);
      },
    ),
    GoRoute(
      path: '/history',
      builder: (context, state) => const LocalHistoryScreen(),
    ),
    // Officer Routes
    GoRoute(
      path: '/officer-login',
      builder: (context, state) => const OfficerLoginScreen(),
    ),
    GoRoute(
      path: '/officer-dashboard',
      builder: (context, state) => const OfficerDashboardScreen(),
    ),
    GoRoute(
      path: '/officer-qr',
      builder: (context, state) => const OfficerQrScreen(),
    ),
    GoRoute(
      path: '/officer-live-feed',
      builder: (context, state) => const OfficerLiveFeedScreen(),
    ),
  ],
);

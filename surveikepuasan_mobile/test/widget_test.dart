import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:surveikepuasan_mobile/main.dart';

void main() {
  testWidgets('App smoke test loads successfully', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: SurveiKepuasanApp(),
      ),
    );
    expect(find.byType(SurveiKepuasanApp), findsOneWidget);
  });
}
